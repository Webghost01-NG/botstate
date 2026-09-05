# BOTSTATE

A fractional real estate protocol prototype on BOT Chain. The current website provides a clearly labeled sample catalog, rule-based recommendations, mainnet deployment checks and read-only portfolio queries.

Live application: https://frontend-ecru-nu-85.vercel.app

## Current release: verified-flows-v1

Purchases, property registration payments and oracle signing are disabled. The former purchase flow did not call the marketplace, and registration collected a fee without creating an asset. No sample property has a verified listing mapping. Browser storage is no longer used as proof of ownership or transaction confirmation. Sample prices and yields are not verified investments, appraisals or revenue.

The public fallback signing key has been removed. It remains exposed in Git history and must never be reused. Any authority controlled by that key requires a separately authorized rotation before signing or administrative writes can resume. This release does not move funds, rotate on-chain authorities or deploy contracts.

## Contracts and deployment boundary

Original mainnet transaction hashes and addresses remain in `shared/mainnet-deployed-addresses.json`. The proof page checks chain ID, successful creation receipt, matching contract address/block and nonempty deployed code. These checks are not an audit or compiled-runtime equivalence proof.

The updated `RWAToken.sol` implements funded, pull-based dividend claims and preserves accrued rights across transfers. Updated `AgentActionLog.sol` supports EIP-712 v2 attestations with chain/contract binding, deadlines and replay nonces. **These source changes are not deployed to mainnet.** Existing deployed tokens still lack holder payouts and existing logs do not verify typed signatures. No UI action should send funds to the old dividend function.

Token balances do not establish a verified legal claim to real property. The catalog contains sample data, not verified assets under management. No TVL, model accuracy, reputation or realized yield is asserted.

## Development and checks

Frontend: Next.js 16 / React 19 / ethers 6. Contracts: Solidity 0.8.20; original deployment records are unchanged.

```sh
npm ci --prefix frontend
npm test --prefix frontend
npm run build --prefix frontend
npm ci --prefix contracts
npm test --prefix contracts
npm run dev --prefix frontend
```

Contract tests use the local Hardhat EVM only. Production writes require secure authority, verified deployment/runtime correspondence, property-to-token-to-listing mapping and receipt-based end-to-end testing before activation.

See [PROTOCOL.md](PROTOCOL.md) for release gates and remaining limits.
