export class AgentService {
  getProfile() {
    return {
      agentId: "AIDID-BOTSTATE-001",
      name: "BOTSTATE AI Advisor",
      reputation: 98,
      totalRecommendations: 1250,
      accuracy: "92%",
      history: [
        { date: "2026-08-15", action: "Identified undervalued asset in Lisbon", status: "Verified" },
        { date: "2026-08-12", action: "Adjusted risk model for US coastal properties", status: "Verified" }
      ]
    };
  }

  getActions() {
    return {
      actions: [
        { id: "act-1", timestamp: Date.now() - 86400000, type: "VALUATION", target: "prop-1", txHash: "0xabc123..." },
        { id: "act-2", timestamp: Date.now() - 172800000, type: "RECOMMENDATION", target: "0xuser...", txHash: "0xdef456..." }
      ]
    };
  }
}

export const agentService = new AgentService();
