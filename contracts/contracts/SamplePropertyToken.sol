// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RWAToken.sol";

/// @notice Demonstration token. No property ownership or promised rental income.
contract SamplePropertyToken is RWAToken {
    bool public constant isSampleAsset = true;
    string public constant sampleNotice = "SAMPLE ONLY: no real property, ownership rights or promised returns";
    uint256 public constant faucetAmount = 10 ether;
    mapping(address => bool) public hasClaimedSample;
    event SampleClaimed(address indexed recipient, uint256 amount);

    constructor(uint256 id, address administrator)
        RWAToken("BOTSTATE Sample Residence", "SAMPLE-RWA", id, 0, 0, 100000 ether, administrator)
    {
        _transfer(administrator, address(this), totalSupply());
    }

    function claimSample() external {
        require(!hasClaimedSample[msg.sender], "Sample already claimed");
        hasClaimedSample[msg.sender] = true;
        _transfer(address(this), msg.sender, faucetAmount);
        emit SampleClaimed(msg.sender, faucetAmount);
    }
}
