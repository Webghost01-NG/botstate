// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title AgentActionLog
 * @dev Logs AI agent recommendations and valuations on-chain for transparency
 */
contract AgentActionLog is Ownable {
    bytes32 public constant ATTESTATION_TYPEHASH = keccak256("ValuationAttestation(uint256 propertyId,uint256 valuation,uint256 nonce,uint256 deadline)");
    mapping(address => uint256) public nonces;
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
        require(_agentDID != address(0), "Invalid agent");
        agentDID = _agentDID;
    }

    function setAgentDID(address _agentDID) external onlyOwner {
        require(_agentDID != address(0), "Invalid agent");
        nonces[agentDID]++;
        nonces[_agentDID]++;
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

    function submitValuation(uint256 propertyId, uint256 value, uint256 nonce, uint256 deadline, bytes calldata signature) external {
        require(block.timestamp <= deadline, "Attestation expired");
        require(nonce == nonces[agentDID], "Invalid nonce");
        bytes32 domain = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256("BOTSTATE_VALUATION_ORACLE"), keccak256("2"), block.chainid, address(this)
        ));
        bytes32 digest = keccak256(abi.encodePacked(hex"1901", domain, keccak256(abi.encode(ATTESTATION_TYPEHASH, propertyId, value, nonce, deadline))));
        require(ECDSA.recover(digest, signature) == agentDID, "Invalid signer");
        nonces[agentDID]++;
        valuations.push(Valuation(propertyId, value, "EIP-712 v2 signed attestation", block.timestamp));
        emit ValuationLogged(propertyId, value);
    }
}
