import OpenAI from 'openai';
import { CONSTANTS } from '../utils/constants.js';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder'
});

export class AiService {
  async chat(message, conversationHistory, properties) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      // Built-in intelligent response engine
      return this._generateLocalResponse(message, properties);
    }

    try {
      const messages = [
        { role: 'system', content: CONSTANTS.AI_SYSTEM_PROMPT },
        { role: 'system', content: `Available property listings: ${JSON.stringify(properties.slice(0, 8))}` },
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        temperature: 0.7
      });

      const aiResponse = response.choices[0].message.content;
      const recommendations = this._extractRecommendations(message, properties);

      return {
        response: aiResponse,
        propertyRecommendations: recommendations,
        actionType: 'analysis'
      };
    } catch (error) {
      console.error('AI Service Error:', error.message);
      return this._generateLocalResponse(message, properties);
    }
  }

  _generateLocalResponse(message, properties) {
    const lowerMsg = message.toLowerCase();
    let response = '';
    let recommendations = [];

    if (lowerMsg.includes('yield') || lowerMsg.includes('high return') || lowerMsg.includes('profit')) {
      const highYield = properties.filter(p => p.yield >= 7.5).sort((a, b) => b.yield - a.yield).slice(0, 3);
      recommendations = highYield;
      response = `Looking for high-yield opportunities? Here are the top performers in our portfolio:\n\n${highYield.map((p, i) => `${i + 1}. **${p.name}** — ${p.location}, ${p.country}\n   Yield: ${p.yield}% APY | Token Price: $${p.tokenPrice} | Risk: ${p.riskScore}/10`).join('\n\n')}\n\nThese properties offer the strongest return potential. Would you like a deeper analysis on any of them?`;
    } else if (lowerMsg.includes('cheap') || lowerMsg.includes('affordable') || lowerMsg.includes('budget') || lowerMsg.includes('low price')) {
      const affordable = properties.filter(p => p.price <= 50000).sort((a, b) => a.price - b.price).slice(0, 3);
      recommendations = affordable;
      response = `Here are the most accessible entry points for new investors:\n\n${affordable.map((p, i) => `${i + 1}. **${p.name}** — ${p.location}\n   Price: $${p.price.toLocaleString()} | Yield: ${p.yield}% APY | Tokens: ${p.totalTokens}`).join('\n\n')}\n\nFractional ownership lets you start small. Interested in any of these?`;
    } else if (lowerMsg.includes('risk') || lowerMsg.includes('safe') || lowerMsg.includes('stable')) {
      const lowRisk = properties.filter(p => p.riskScore <= 4).sort((a, b) => a.riskScore - b.riskScore).slice(0, 3);
      recommendations = lowRisk;
      response = `For risk-averse investors, I recommend these stable picks:\n\n${lowRisk.map((p, i) => `${i + 1}. **${p.name}** — Risk Score: ${p.riskScore}/10\n   ${p.location} | Yield: ${p.yield}% APY | $${p.price.toLocaleString()}`).join('\n\n')}\n\nThese properties are in established markets with strong regulatory frameworks.`;
    } else if (lowerMsg.includes('asia') || lowerMsg.includes('tokyo') || lowerMsg.includes('singapore') || lowerMsg.includes('bali')) {
      const asian = properties.filter(p => ['Japan', 'Singapore', 'Indonesia', 'Thailand', 'India'].includes(p.country)).slice(0, 3);
      recommendations = asian;
      response = asian.length > 0 ? `Great choice — Asia-Pacific is booming. Here's what we have:\n\n${asian.map((p, i) => `${i + 1}. **${p.name}** — ${p.location}, ${p.country}\n   Price: $${p.price.toLocaleString()} | Yield: ${p.yield}% APY`).join('\n\n')}` : 'I don\'t have Asian properties matching that specific criteria, but I can help you explore other high-growth regions.';
    } else if (lowerMsg.includes('europe') || lowerMsg.includes('london') || lowerMsg.includes('berlin') || lowerMsg.includes('lisbon') || lowerMsg.includes('paris')) {
      const european = properties.filter(p => ['UK', 'Germany', 'Portugal', 'France', 'Spain', 'Netherlands'].includes(p.country)).slice(0, 3);
      recommendations = european;
      response = european.length > 0 ? `European real estate is a solid pick. Here's our European portfolio:\n\n${european.map((p, i) => `${i + 1}. **${p.name}** — ${p.location}, ${p.country}\n   Price: $${p.price.toLocaleString()} | Yield: ${p.yield}% APY`).join('\n\n')}` : 'No European properties match that filter right now. Want to broaden the search?';
    } else {
      recommendations = properties.slice(0, 3);
      response = `I'm BOTSTATE, your AI real estate advisor on BOT Chain. I can help you:\n\n• 🔍 **Find properties** — Tell me your budget, preferred yield, or location\n• 📊 **Analyze investments** — I'll break down risk, return, and market trends\n• 💰 **Compare options** — Side-by-side analysis of any properties\n• 🏗️ **Explain tokenization** — How fractional ownership works on-chain\n\nHere are a few featured properties to get started:\n\n${recommendations.map((p, i) => `${i + 1}. **${p.name}** — ${p.location} | $${p.price.toLocaleString()} | ${p.yield}% APY`).join('\n')}\n\nWhat interests you?`;
    }

    return {
      response,
      propertyRecommendations: recommendations,
      actionType: 'recommendation'
    };
  }

  _extractRecommendations(message, properties) {
    const lowerMsg = message.toLowerCase();
    return properties.filter(p =>
      lowerMsg.includes(p.country?.toLowerCase()) ||
      lowerMsg.includes(p.location?.toLowerCase()) ||
      lowerMsg.includes(p.name?.toLowerCase())
    ).slice(0, 3);
  }
}

export const aiService = new AiService();
