const { expect } = require('chai');
const { ethers } = require('hardhat');
describe('Permanent sample asset', function () {
  it('creates an owner-authorized sample, exposes its notice, and gives each judge free tokens once', async function () {
    const [owner, judge] = await ethers.getSigners();
    const factory = await (await ethers.getContractFactory('RWATokenFactory')).deploy();
    await expect(factory.connect(judge).createSampleToken(900001)).to.be.reverted;
    await factory.createSampleToken(900001);
    const token = await ethers.getContractAt('SamplePropertyToken', await factory.propertyTokens(900001));
    expect(await token.owner()).to.equal(owner.address);
    expect(await token.isSampleAsset()).to.equal(true);
    expect(await token.sampleNotice()).to.include('no real property');
    expect(await token.yieldRate()).to.equal(0);
    expect(await token.balanceOf(owner.address)).to.equal(0);
    await token.connect(judge).claimSample();
    expect(await token.balanceOf(judge.address)).to.equal(ethers.parseEther('10'));
    await expect(token.connect(judge).claimSample()).to.be.revertedWith('Sample already claimed');
    await expect(judge.sendTransaction({ to: token.target, value: 1 })).to.be.reverted;
    await expect(factory.createSampleToken(900001)).to.be.reverted;
  });
});
