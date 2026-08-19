import { NextResponse } from 'next/server';
import properties from '../../data/properties.json';

export async function POST(request) {
  try {
    const { message } = await request.json();
    const lowerMsg = (message || '').toLowerCase();
    let reply = '';
    let recommendations = [];

    if (lowerMsg.includes('balance') || lowerMsg.includes('wallet') || lowerMsg.includes('funds') || lowerMsg.includes('tbot')) {
      recommendations = properties.filter(p => p.yield >= 8.0).slice(0, 2);
      reply = `💰 **Your On-Chain Wallet Status:**\n\n• **Network:** BOT Chain Testnet (Chain ID: 968)\n• **Native Balance:** **10.0 tBOT** (Ready for investment)\n• **Connected Wallet:** \`0x6CeD...f1F2\`\n\nWith **10.0 tBOT**, you can purchase up to **200 fractional tokens** across our global portfolio (starting at just 0.05 tBOT/token).\n\nHere are two high-yield properties ready for instant on-chain settlement:`;
    } else if (lowerMsg.includes('what can i do') || lowerMsg.includes('how to start') || lowerMsg.includes('next step') || lowerMsg.includes('help')) {
      recommendations = properties.slice(0, 2);
      reply = `🚀 **Here is what you can do right now on BOTSTATE:**\n\n1. **Explore 16 Global Properties** — Browse prime institutional assets in Dubai, Tokyo, London, Singapore, Bali, and Berlin.\n2. **Inspect AI Valuations** — Review real-time machine learning appraisals with **EIP-712 cryptographic signatures**.\n3. **Buy Fractional Tokens On-Chain** — Connect MetaMask and purchase tokens starting from **0.05 tBOT** with instant block settlement.\n4. **Track Automated Yields** — View your quarterly rental payouts on your **[Portfolio](/portfolio)** page.\n5. **Verify On-Chain Proof** — Audit all deployed contracts and block receipts on the **[Proof](/proof)** page.\n\nWhere would you like to start?`;
    } else if (lowerMsg.includes('yield') || lowerMsg.includes('high return') || lowerMsg.includes('profit') || lowerMsg.includes('best return')) {
      const highYield = properties.filter(p => p.yield >= 7.5).sort((a, b) => b.yield - a.yield).slice(0, 3);
      recommendations = highYield;
      reply = `📈 **Top Yielding Global Real Estate Opportunities:**\n\nThese assets deliver maximum cashflow with quarterly automated dividend distributions directly to your wallet on BOT Chain Testnet:`;
    } else if (lowerMsg.includes('cheap') || lowerMsg.includes('affordable') || lowerMsg.includes('budget') || lowerMsg.includes('low price')) {
      const affordable = properties.filter(p => p.price <= 50000).sort((a, b) => a.price - b.price).slice(0, 3);
      recommendations = affordable;
      reply = `🏷️ **Most Accessible Entry Points for Fractional Investors:**\n\nFractional ownership lets you co-own high-value physical deeds starting with just 1 token:`;
    } else if (lowerMsg.includes('risk') || lowerMsg.includes('safe') || lowerMsg.includes('stable')) {
      const lowRisk = properties.filter(p => p.riskScore <= 2).sort((a, b) => a.riskScore - b.riskScore).slice(0, 3);
      recommendations = lowRisk;
      reply = `🛡️ **Lowest-Risk Institutional Assets (Tier 1 Preservation):**\n\nBacked by long-term corporate leases and 100% historical occupancy in established global regulatory hubs:`;
    } else if (lowerMsg.includes('dubai') || lowerMsg.includes('uae')) {
      recommendations = properties.filter(p => p.country === 'UAE');
      reply = `🏙️ **Dubai Real Estate Portfolio:**\n\nDubai offers high capital appreciation and zero property tax on rental yields:`;
    } else if (lowerMsg.includes('tokyo') || lowerMsg.includes('japan')) {
      recommendations = properties.filter(p => p.country === 'Japan');
      reply = `🗾 **Tokyo Real Estate Portfolio:**\n\nPrime micro-living units in Shibuya and Shinjuku with consistent high tenant retention:`;
    } else if (lowerMsg.includes('asia') || lowerMsg.includes('singapore') || lowerMsg.includes('bali')) {
      recommendations = properties.filter(p => ['Japan', 'Singapore', 'Indonesia', 'Thailand', 'India'].includes(p.country)).slice(0, 3);
      reply = `🌏 **Asia-Pacific High-Growth Markets:**\n\nRapidly appreciating tourism and commercial real estate hubs:`;
    } else if (lowerMsg.includes('europe') || lowerMsg.includes('london') || lowerMsg.includes('berlin') || lowerMsg.includes('lisbon')) {
      recommendations = properties.filter(p => ['UK', 'Germany', 'Portugal', 'France', 'Spain', 'Netherlands'].includes(p.country)).slice(0, 3);
      reply = `🏰 **European Prime Real Estate Portfolio:**\n\nStable commercial and residential investments across London, Berlin, and Lisbon:`;
    } else {
      recommendations = properties.slice(0, 3);
      reply = `🏛️ **Welcome to BOTSTATE AI Advisor!**\n\nI am your autonomous real estate intelligence agent on BOT Chain. How can I assist your portfolio today?\n\n• 🔍 **Search by market** (e.g., *"Show Dubai properties"*, *"Find European commercial"*)\n• 📈 **Search by APY** (e.g., *"Show highest yield"*)\n• 💰 **Check wallet** (e.g., *"Check my balance"*)\n• 🛡️ **Risk analysis** (e.g., *"Find low risk properties"*)\n\nHere are a few featured selections to consider:`;
    }

    return NextResponse.json({
      response: reply,
      reply: reply,
      propertyRecommendations: recommendations,
      properties: recommendations,
      actionType: 'recommendation'
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
