import { ethers } from 'ethers';
import { CONSTANTS } from '../utils/constants.js';
import dotenv from 'dotenv';
dotenv.config();

export class BlockchainService {
  constructor() {
    this.rpcUrl = process.env.BOT_CHAIN_RPC || CONSTANTS.BOT_CHAIN_RPC;
    this.provider = null;
    this.initialized = false;
    this._init();
  }

  async _init() {
    try {
      this.provider = new ethers.JsonRpcProvider(this.rpcUrl, CONSTANTS.BOT_CHAIN_ID);
      await this.provider.getBlockNumber();
      this.initialized = true;
      console.log('✅ Connected to BOT Chain (Chain ID 677)');
    } catch (e) {
      console.warn('⚠️  BOT Chain RPC unavailable. On-chain reads disabled until connection restored.');
      this.provider = null;
    }
  }

  async getProvider() {
    if (!this.provider) {
      await this._init();
    }
    return this.provider;
  }

  async getUserPortfolio(address) {
    if (!ethers.isAddress(address)) {
      return { holdings: [], totalValue: 0, totalYield: 0, aiRecommendations: [] };
    }

    const provider = await this.getProvider();
    let balance = '0';
    if (provider) {
      try {
        const raw = await provider.getBalance(address);
        balance = ethers.formatEther(raw);
      } catch (e) {
        console.warn('Could not fetch on-chain balance:', e.message);
      }
    }

    return {
      walletBalance: balance,
      holdings: [],
      totalValue: 0,
      totalYield: 0,
      aiRecommendations: [
        'Connect your wallet and invest in tokenized properties to build your portfolio.',
        'Start with high-yield properties to maximize returns on your BOT investment.'
      ]
    };
  }

  async getNetworkInfo() {
    const provider = await this.getProvider();
    if (!provider) {
      return { connected: false, chainId: null, blockNumber: null };
    }
    try {
      const network = await provider.getNetwork();
      const blockNumber = await provider.getBlockNumber();
      return {
        connected: true,
        chainId: Number(network.chainId),
        blockNumber,
        rpcUrl: this.rpcUrl
      };
    } catch (e) {
      return { connected: false, chainId: null, blockNumber: null };
    }
  }
}

export const blockchainService = new BlockchainService();
