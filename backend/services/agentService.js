export class AgentService {
  getProfile() { return { name: 'BOTSTATE catalog assistant', mode: 'sample', reputation: null, accuracy: null, signingEnabled: false, history: [] }; }
  getActions() { return { actions: [], source: 'No verified agent history configured' }; }
}
export const agentService = new AgentService();
