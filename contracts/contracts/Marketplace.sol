// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Marketplace
 * @dev Allows users to buy property tokens with native BOT currency
 */
contract Marketplace is ReentrancyGuard, Ownable {
    struct Listing {
        uint256 listingId;
        address seller;
        address tokenAddress;
        uint256 amount;
        uint256 pricePerToken; // in wei
        bool active;
    }

    uint256 public nextListingId;
    mapping(uint256 => Listing) public listings;
    uint256 public feePercentage = 1; // 1% fee

    event Listed(uint256 indexed listingId, address indexed seller, address tokenAddress, uint256 amount, uint256 pricePerToken);
    event Sold(uint256 indexed listingId, address indexed buyer, uint256 amount, uint256 totalPrice);
    event ListingCancelled(uint256 indexed listingId);

    constructor() Ownable(msg.sender) {}

    function listForSale(address tokenAddress, uint256 amount, uint256 pricePerToken) external {
        require(amount > 0, "Amount must be greater than zero");
        require(pricePerToken > 0, "Price must be greater than zero");

        IERC20 token = IERC20(tokenAddress);
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        uint256 listingId = nextListingId++;
        listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            tokenAddress: tokenAddress,
            amount: amount,
            pricePerToken: pricePerToken,
            active: true
        });

        emit Listed(listingId, msg.sender, tokenAddress, amount, pricePerToken);
    }

    function buyTokens(uint256 listingId, uint256 amount) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing is not active");
        require(amount > 0 && amount <= listing.amount, "Invalid amount");

        uint256 totalPrice = amount * listing.pricePerToken;
        uint256 fee = (totalPrice * feePercentage) / 100;
        require(msg.value == totalPrice, "Incorrect value sent");

        listing.amount -= amount;
        if (listing.amount == 0) {
            listing.active = false;
        }

        IERC20 token = IERC20(listing.tokenAddress);
        require(token.transfer(msg.sender, amount), "Token transfer failed");

        // Send funds to seller (minus fee)
        (bool success, ) = payable(listing.seller).call{value: totalPrice - fee}("");
        require(success, "Transfer to seller failed");

        emit Sold(listingId, msg.sender, amount, totalPrice);
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing is not active");
        require(listing.seller == msg.sender, "Not the seller");

        listing.active = false;

        IERC20 token = IERC20(listing.tokenAddress);
        require(token.transfer(msg.sender, listing.amount), "Token transfer failed");

        emit ListingCancelled(listingId);
    }

    function getListings() external view returns (Listing[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < nextListingId; i++) {
            if (listings[i].active) {
                activeCount++;
            }
        }

        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < nextListingId; i++) {
            if (listings[i].active) {
                activeListings[currentIndex] = listings[i];
                currentIndex++;
            }
        }

        return activeListings;
    }

    function withdrawFees() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}
