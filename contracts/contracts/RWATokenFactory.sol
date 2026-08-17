// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RWAToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RWATokenFactory
 * @dev Factory pattern to deploy a new ERC-20 token per property
 */
contract RWATokenFactory is Ownable {
    mapping(uint256 => address) public propertyTokens;
    
    event TokenCreated(uint256 indexed propertyId, address tokenAddress, string name, string symbol);

    constructor() Ownable(msg.sender) {}

    function createToken(
        uint256 propertyId,
        string calldata name,
        string calldata symbol,
        uint256 totalPropertyValue,
        uint256 yieldRate,
        uint256 totalSupply
    ) external onlyOwner returns (address) {
        require(propertyTokens[propertyId] == address(0), "Token already created for this property");

        RWAToken newToken = new RWAToken(
            name,
            symbol,
            propertyId,
            totalPropertyValue,
            yieldRate,
            totalSupply,
            msg.sender
        );

        propertyTokens[propertyId] = address(newToken);
        
        emit TokenCreated(propertyId, address(newToken), name, symbol);
        return address(newToken);
    }
}
