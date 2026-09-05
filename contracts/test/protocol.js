const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Protocol regressions (local EVM only)', function () {
  it('settles an actual marketplace call, rejects plain payments and pays the seller less the fee', async function () {
    const [owner,buyer] = await ethers.getSigners();
    const token = await (await ethers.getContractFactory('RWAToken')).deploy('Property','RWA',1,1000,800,100,owner.address);
    const market = await (await ethers.getContractFactory('Marketplace')).deploy();
    await token.approve(market.target,10);
    await market.listForSale(token.target,10,100);
    await expect(buyer.sendTransaction({to:market.target,value:100})).to.be.reverted;
    await expect(market.connect(buyer).buyTokens(0,2,{value:200})).to.changeEtherBalances([owner,market],[198,2]);
    expect(await token.balanceOf(buyer.address)).to.equal(2);
    await expect(market.connect(buyer).buyTokens(0,1,{value:1})).to.be.revertedWith('Incorrect value sent');
  });
  it('pays funded dividends and preserves accrued rights after transfers', async function () {
    const [owner,buyer] = await ethers.getSigners();
    const token = await (await ethers.getContractFactory('RWAToken')).deploy('Property','RWA',1,1000,800,100,owner.address);
    await token.transfer(buyer.address,25);
    await token.distributeDividends({value:400});
    await token.connect(buyer).transfer(owner.address,25);
    expect(await token.claimableDividends(buyer.address)).to.equal(100);
    await expect(token.connect(buyer).claimDividends()).to.changeEtherBalance(buyer,100);
    await expect(token.connect(buyer).claimDividends()).to.be.revertedWith('No dividends');
    await token.distributeDividends({value:400});
    expect(await token.claimableDividends(owner.address)).to.equal(700);
    expect(await token.claimableDividends(buyer.address)).to.equal(0);
    await expect(token.connect(buyer).distributeDividends({value:1})).to.be.reverted;
  });
  it('rejects replayed, altered, expired and wrong-domain signed valuations', async function () {
    const [agent,relayer] = await ethers.getSigners();
    const log = await (await ethers.getContractFactory('AgentActionLog')).deploy(agent.address);
    const domain = {name:'BOTSTATE_VALUATION_ORACLE',version:'2',chainId:(await ethers.provider.getNetwork()).chainId,verifyingContract:log.target};
    const types = {ValuationAttestation:[{name:'propertyId',type:'uint256'},{name:'valuation',type:'uint256'},{name:'nonce',type:'uint256'},{name:'deadline',type:'uint256'}]};
    const deadline = (await ethers.provider.getBlock('latest')).timestamp + 1000;
    const value = {propertyId:1,valuation:1000,nonce:0,deadline};
    const signature = await agent.signTypedData(domain,types,value);
    await expect(log.connect(relayer).submitValuation(1,1001,0,deadline,signature)).to.be.revertedWith('Invalid signer');
    const wrong = await agent.signTypedData({...domain,chainId:677},types,value);
    await expect(log.submitValuation(1,1000,0,deadline,wrong)).to.be.revertedWith('Invalid signer');
    await log.connect(relayer).submitValuation(1,1000,0,deadline,signature);
    await expect(log.submitValuation(1,1000,0,deadline,signature)).to.be.revertedWith('Invalid nonce');
    await expect(log.submitValuation(1,1000,1,1,signature)).to.be.revertedWith('Attestation expired');
    await expect(log.connect(relayer).setAgentDID(relayer.address)).to.be.reverted;
  });
  it('restricts property registration and token creation to the owner', async function () {
    const [,other] = await ethers.getSigners();
    const registry = await (await ethers.getContractFactory('PropertyRegistry')).deploy();
    const factory = await (await ethers.getContractFactory('RWATokenFactory')).deploy();
    await expect(registry.connect(other).registerProperty(1,other.address,'uri',100,'city')).to.be.reverted;
    await expect(factory.connect(other).createToken(1,'Name','RWA',100,1,100)).to.be.reverted;
  });
});
