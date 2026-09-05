import { readPortfolio, requireMainnet, rpc } from '../../frontend/app/utils/chain.mjs';
export class BlockchainService {
  async getUserPortfolio(address) { return readPortfolio(address); }
  async getNetworkInfo() {
    try { await requireMainnet(); return { connected: true, chainId: 677, blockNumber: Number(BigInt(await rpc('eth_blockNumber'))) }; }
    catch { return { connected: false, chainId: null, blockNumber: null }; }
  }
}
export const blockchainService = new BlockchainService();
