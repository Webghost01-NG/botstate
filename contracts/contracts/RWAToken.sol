// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

/**
 * @title RWAToken
 * @dev Standard ERC-20 token representing fractional ownership of a property
 */
contract RWAToken is ERC20, Ownable, ReentrancyGuard {
    using SafeCast for uint256;
    uint256 private constant MAGNITUDE = 2 ** 64;
    uint256 public dividendPerShare;
    mapping(address => int256) private dividendCorrections;
    mapping(address => uint256) public withdrawnDividends;
    event DividendClaimed(address indexed holder, uint256 amount);
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
        require(totalSupply > 0 && totalSupply <= type(uint128).max, "Invalid supply");
        propertyId = _propertyId;
        totalPropertyValue = _totalPropertyValue;
        yieldRate = _yieldRate;
        _mint(factoryOwner, totalSupply);
    }

    function distributeDividends() external payable onlyOwner {
        require(msg.value > 0, "Must send dividends");
        dividendPerShare += (msg.value * MAGNITUDE) / totalSupply();
        emit DividendsDistributed(msg.value);
    }

    function claimableDividends(address holder) public view returns (uint256) {
        int256 accrued = (dividendPerShare * balanceOf(holder)).toInt256() + dividendCorrections[holder];
        return uint256(accrued) / MAGNITUDE - withdrawnDividends[holder];
    }

    function claimDividends() external nonReentrant {
        uint256 amount = claimableDividends(msg.sender);
        require(amount > 0, "No dividends");
        withdrawnDividends[msg.sender] += amount;
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "Dividend payment failed");
        emit DividendClaimed(msg.sender, amount);
    }

    // A transfer changes future dividend weight, never previously accrued rights.
    function _update(address from, address to, uint256 amount) internal override {
        super._update(from, to, amount);
        int256 correction = (dividendPerShare * amount).toInt256();
        if (from != address(0)) dividendCorrections[from] += correction;
        if (to != address(0)) dividendCorrections[to] -= correction;
    }
}
