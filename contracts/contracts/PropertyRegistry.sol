// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PropertyRegistry
 * @dev Stores property listings on-chain
 */
contract PropertyRegistry is Ownable {
    struct Property {
        uint256 propertyId;
        address owner;
        string metadataURI;
        uint256 aiValuation;
        string location;
        bool isActive;
        uint256 timestamp;
    }

    mapping(uint256 => Property) public properties;
    uint256[] public propertyIds;
    
    mapping(address => bool) public authorizedAgents;

    event PropertyRegistered(uint256 indexed propertyId, address indexed owner, string location);
    event ValuationUpdated(uint256 indexed propertyId, uint256 newValuation);
    event AgentAuthorized(address indexed agent, bool status);

    modifier onlyAuthorized() {
        require(msg.sender == owner() || authorizedAgents[msg.sender], "Not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function setAuthorizedAgent(address agent, bool status) external onlyOwner {
        authorizedAgents[agent] = status;
        emit AgentAuthorized(agent, status);
    }

    function registerProperty(
        uint256 propertyId,
        address propertyOwner,
        string calldata metadataURI,
        uint256 initialValuation,
        string calldata location
    ) external onlyOwner {
        require(properties[propertyId].timestamp == 0, "Property already exists");

        properties[propertyId] = Property({
            propertyId: propertyId,
            owner: propertyOwner,
            metadataURI: metadataURI,
            aiValuation: initialValuation,
            location: location,
            isActive: true,
            timestamp: block.timestamp
        });
        propertyIds.push(propertyId);

        emit PropertyRegistered(propertyId, propertyOwner, location);
    }

    function updateValuation(uint256 propertyId, uint256 newValuation) external onlyAuthorized {
        require(properties[propertyId].timestamp != 0, "Property does not exist");
        properties[propertyId].aiValuation = newValuation;
        emit ValuationUpdated(propertyId, newValuation);
    }

    function getProperty(uint256 propertyId) external view returns (Property memory) {
        require(properties[propertyId].timestamp != 0, "Property does not exist");
        return properties[propertyId];
    }

    function listActiveProperties() external view returns (Property[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < propertyIds.length; i++) {
            if (properties[propertyIds[i]].isActive) {
                activeCount++;
            }
        }

        Property[] memory activeProperties = new Property[](activeCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < propertyIds.length; i++) {
            if (properties[propertyIds[i]].isActive) {
                activeProperties[currentIndex] = properties[propertyIds[i]];
                currentIndex++;
            }
        }
        return activeProperties;
    }
}
