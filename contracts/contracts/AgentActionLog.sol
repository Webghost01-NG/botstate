// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentActionLog
 * @dev Logs AI agent recommendations and valuations on-chain for transparency
 */
contract AgentActionLog is Ownable {
    address public agentDID;

    struct Recommendation {
        uint256 propertyId;
        string action;
        uint256 confidence;
        string reasoning;
        uint256 timestamp;
    }

    struct Valuation {
        uint256 propertyId;
        uint256 valuation;
        string methodology;
        uint256 timestamp;
    }

    Recommendation[] public recommendations;
    Valuation[] public valuations;

    event RecommendationLogged(uint256 indexed propertyId, string action, uint256 confidence);
    event ValuationLogged(uint256 indexed propertyId, uint256 valuation);

    modifier onlyAgent() {
        require(msg.sender == agentDID, "Not authorized agent");
        _;
    }

    constructor(address _agentDID) Ownable(msg.sender) {
        agentDID = _agentDID;
    }

    function setAgentDID(address _agentDID) external onlyOwner {
        agentDID = _agentDID;
    }

    function logRecommendation(
        uint256 propertyId,
        string calldata action,
        uint256 confidence,
        string calldata reasoning
    ) external onlyAgent {
        recommendations.push(Recommendation({
            propertyId: propertyId,
            action: action,
            confidence: confidence,
            reasoning: reasoning,
            timestamp: block.timestamp
        }));

        emit RecommendationLogged(propertyId, action, confidence);
    }

    function logValuation(
        uint256 propertyId,
        uint256 valuation,
        string calldata methodology
    ) external onlyAgent {
        valuations.push(Valuation({
            propertyId: propertyId,
            valuation: valuation,
            methodology: methodology,
            timestamp: block.timestamp
        }));

        emit ValuationLogged(propertyId, valuation);
    }

    function getAgentHistory() external view returns (Recommendation[] memory, Valuation[] memory) {
        return (recommendations, valuations);
    }

    function getRecommendationCount() external view returns (uint256) {
        return recommendations.length;
    }
}
