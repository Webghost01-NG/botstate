# BOTSTATE

A fractional real estate protocol prototype on BOT Chain. The current website provides a clearly labeled sample catalog, rule-based recommendations, mainnet deployment checks and read-only portfolio queries.

Live application: https://frontend-ecru-nu-85.vercel.app

## MetaMask deployment and judge samples

Open `/deploy` to prepare six wallet-confirmed transactions: four new core contracts, one fictional sample registry entry and one permanently labeled sample token. Every transaction has zero native value; mainnet gas still costs BOT. The browser uses compiled public artifacts, never a private key. Use a fresh account: the previously exposed key was confirmed to control `0x6CeD8D6Bad8Dfd2e60BCEA116fE74548f959f1F2`.

Connect MetaMask, estimate each step, review its calldata/gas, and click **Open MetaMask to confirm**. Check confirmations before continuing. Download the deployment records. Saved/imported references are rechecked against actual transactions, receipts and exact runtime hashes; they are never treated as proof by themselves.

After all six steps confirm, share the generated `/judge?token=...` link. Judges can claim ten free SAMPLE-RWA tokens once per wallet, paying only mainnet gas. The immutable on-chain notice says these are sample assets with no real property, ownership rights or promised returns. The default real-investment routes remain disabled. A completed sample deployment does not automatically overwrite the original mainnet registry; export the receipts for review and subsequent site configuration.

Rebuild browser artifacts after contract edits: `npm test --prefix contracts && node contracts/scripts/exportBrowserArtifacts.js`. Verify synchronization with `node contracts/scripts/exportBrowserArtifacts.js --check`. This new deployment build uses Solidity 0.8.20, optimizer 200 runs and Paris EVM to stay below the factory code-size limit. Old deployments are unchanged.

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
