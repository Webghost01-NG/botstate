// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RWAToken
 * @dev Standard ERC-20 token representing fractional ownership of a property
 */
contract RWAToken is ERC20, Ownable {
    uint256 public propertyId;
    uint256 public totalPropertyValue;
    uint256 public yieldRate;

    event DividendsDistributed(uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        uint256 _propertyId,
        uint256 _totalPropertyValue,
        uint256 _yieldRate,
        uint256 totalSupply,
        address factoryOwner
    ) ERC20(name, symbol) Ownable(factoryOwner) {
        propertyId = _propertyId;
        totalPropertyValue = _totalPropertyValue;
        yieldRate = _yieldRate;
        _mint(factoryOwner, totalSupply);
    }

    function distributeDividends() external payable onlyOwner {
        require(msg.value > 0, "Must send dividends");
        emit DividendsDistributed(msg.value);
    }
}
