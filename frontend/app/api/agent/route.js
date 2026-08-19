import { NextResponse } from 'next/server';

export async function GET() {
  const oracleAddress = '0x6CeD8D6Bad8Dfd2e60BCEA116fE74548f959f1F2';
  return NextResponse.json({
    agentName: 'BOTSTATE AI Advisor',
    oracleDID: `did:bot:${oracleAddress}`,
    status: 'ACTIVE_ON_CHAIN',
    reputationScore: 98.4,
    accuracyRate: '94.2%',
    network: 'BOT Chain Testnet (Chain ID: 968)',
    explorerUrl: `https://scan.bohr.life/address/${oracleAddress}`,
    contracts: {
      PropertyRegistry: '0x61e325c54dbe6b5faf600a96f74cb5bdb3fdb354e7400ffed808996ec7dfe994',
      AgentActionLog: '0x08d1b8fd3b831e79f000ffa3b1b0f69064080f2461e325c54dbe6b5faf600a96'
    }
  });
}
