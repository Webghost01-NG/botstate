import { catalogReply } from '../../frontend/app/utils/catalog.mjs';
export class AiService {
  async chat(message, conversationHistory, properties) {
    const result = catalogReply(message, properties);
    return { response: result.reply, propertyRecommendations: result.properties, actionType: 'sample-filter', mode: 'rule-based-sample' };
  }
}
export const aiService = new AiService();
