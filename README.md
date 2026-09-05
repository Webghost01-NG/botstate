# BOTSTATE

A fractional real-estate protocol prototype on BOT Chain mainnet (chain ID **677**). The updated contracts and a permanently labeled fictional sample token are deployed; the website uses the new registry and factory.

[Live application](https://frontend-ecru-nu-85.vercel.app) · [Try the sample asset](https://frontend-ecru-nu-85.vercel.app/judge) · [Mainnet portfolio](https://frontend-ecru-nu-85.vercel.app/portfolio)

## Current release: sample-mainnet-v1

- Six successful transactions deployed four core contracts, registered sample property 900001 and created its token.
- The sample page verifies exact deployed bytecode, checks eligibility, estimates gas and requests a MetaMask signature to claim **10 SAMPLE-RWA once per wallet**. Token price is zero; real BOT network gas applies.
- Portfolio reads actual native and mapped token balances from the new registry at a single block. Browser storage is not proof of ownership.
- Funded pull-based dividends preserve accrued entitlements across transfers. AgentActionLog supports EIP-712 v2 valuation attestations with chain/contract binding, expiry and replay protection.
- Fake purchase transfers, fee-only registration, fabricated valuations and fallback private-key signing have been removed. Real-investment purchases, registration payments and automated oracle signing remain disabled.
- Demo, Proof and Deploy pages/navigation have been removed. Contract evidence is documented here and exposed read-only through [the protocol API](https://frontend-ecru-nu-85.vercel.app/api/protocol).

**Sample only:** neither the token nor the illustrative catalog represents verified real property, enforceable ownership rights, an independent appraisal or promised rental returns. No verified TVL, model accuracy or realized yield is claimed.

## Try the sample asset

1. Open [BOTSTATE Sample Residence](https://frontend-ecru-nu-85.vercel.app/properties/900001).
2. Connect MetaMask and switch to BOT Chain mainnet. Keep enough BOT for gas.
3. Select **Estimate free claim**, review the estimate, then **Open MetaMask to claim samples**.
4. Review and sign in MetaMask. The site checks the successful receipt and matching SampleClaimed event before showing confirmation.
5. Refresh your balance or open Portfolio and select **Read mainnet**.

Sample token: [`0x6848018dbC74f4929927F7B9ccce62cf536fFE2E`](https://scan.botchain.ai/address/0x6848018dbC74f4929927F7B9ccce62cf536fFE2E)

Property ID: `900001` · Symbol: `SAMPLE-RWA` · Decimals: `18` · Initial supply: `100,000`

[Sample metadata](https://frontend-ecru-nu-85.vercel.app/samples/900001.json)

The on-chain sample notice is permanent. Editing website copy later does not turn these tokens into real-property assets.

## Mainnet transactions

Network: BOT Chain mainnet · Chain ID: `677` · [Explorer](https://scan.botchain.ai) · RPC: `https://rpc.botchain.ai`

Deployer: [`0x6CeD8D6Bad8Dfd2e60BCEA116fE74548f959f1F2`](https://scan.botchain.ai/address/0x6CeD8D6Bad8Dfd2e60BCEA116fE74548f959f1F2)

| Contract | Address | Deployment transaction | Block |
| --- | --- | --- | --- |
| PropertyRegistry | [`0xF18b2a4f7868c9108F678552e0F679AEbC2Ba604`](https://scan.botchain.ai/address/0xF18b2a4f7868c9108F678552e0F679AEbC2Ba604) | [`0xcbe3e522f383ad0186e1c5bdc022012dd8a91e04241a8aec875de34ce9acf3de`](https://scan.botchain.ai/tx/0xcbe3e522f383ad0186e1c5bdc022012dd8a91e04241a8aec875de34ce9acf3de) | 22211997 |
| RWATokenFactory | [`0xd951A7094814DC2Ab9BE5F5E263A0081C89f323F`](https://scan.botchain.ai/address/0xd951A7094814DC2Ab9BE5F5E263A0081C89f323F) | [`0x84c25e366b0c1f56f716ff3a4b850d16de7c526d99f392faefd574c0f72f8499`](https://scan.botchain.ai/tx/0x84c25e366b0c1f56f716ff3a4b850d16de7c526d99f392faefd574c0f72f8499) | 22212243 |
| Marketplace | [`0x602AE8011F478EBbe87Da760C054B5C25911612a`](https://scan.botchain.ai/address/0x602AE8011F478EBbe87Da760C054B5C25911612a) | [`0xb77a03c30981ee80a0f2c90b350e7831dd1d1a96102fc8d259cffb7304624433`](https://scan.botchain.ai/tx/0xb77a03c30981ee80a0f2c90b350e7831dd1d1a96102fc8d259cffb7304624433) | 22212278 |
| AgentActionLog | [`0x79e6B29e253eCA1d506AF330Bb17937Cba9327a7`](https://scan.botchain.ai/address/0x79e6B29e253eCA1d506AF330Bb17937Cba9327a7) | [`0x81de9ce69f7327c0471ba0eddf75faae343c98f100e09e924b8ad7b66beae8da`](https://scan.botchain.ai/tx/0x81de9ce69f7327c0471ba0eddf75faae343c98f100e09e924b8ad7b66beae8da) | 22212333 |

| Sample setup | Transaction | Block |
| --- | --- | --- |
| Register fictional property 900001 | [`0x0027b9d002e633081d91564ee2ff4dd3d473490db9fc0d72288b9f4658701d8e`](https://scan.botchain.ai/tx/0x0027b9d002e633081d91564ee2ff4dd3d473490db9fc0d72288b9f4658701d8e) | 22212387 |
| Factory creates SamplePropertyToken | [`0x9ad6c86c40bb88ed31633104a407f21768d3dff8314b2624d468da56005884e2`](https://scan.botchain.ai/tx/0x9ad6c86c40bb88ed31633104a407f21768d3dff8314b2624d468da56005884e2) | 22212456 |

The sample token was created internally by the factory in the final transaction, not by a separate top-level deployment.

All six transactions were checked against chain ID, sender, zero native value, exact expected deployment/call data and successful receipts. All five contract runtimes matched the compiled artifacts; the sample address was checked against the factory creation event. This is runtime correspondence, **not an independent security audit or explorer source-verification claim**.

Canonical active records and runtime hashes: [active-deployment.json](frontend/app/data/active-deployment.json). Historical deployments remain recorded in [legacy-mainnet-deployed-addresses.json](shared/legacy-mainnet-deployed-addresses.json); those immutable transactions were not changed or migrated.

## Development and verification

Frontend: Next.js 16 / React 19 / ethers 6. Contracts: Solidity 0.8.20, optimizer 200 runs, Paris EVM.

```sh
npm ci --prefix frontend
npm test --prefix frontend
npm run build --prefix frontend
npm ci --prefix contracts
npm test --prefix contracts
node contracts/scripts/exportBrowserArtifacts.js --check
node frontend/scripts/verifyActiveDeployment.mjs
npm run dev --prefix frontend
```

The active-deployment verifier is read-only: it checks all six transactions and five runtimes against the public mainnet RPC. Contract tests execute on the local Hardhat EVM and do not spend mainnet gas. Rebuild browser artifacts after an authorized contract-source change with `node contracts/scripts/exportBrowserArtifacts.js`.

## Remaining limits

This is a sample release, not a production-ready investment protocol. Dividend support does not establish funded rental income. Oracle support does not establish a verified appraisal or a submitted attestation. Real purchase/listing and legal-asset integrations remain gated. The deployment account is a test administrator; its previously exposed authority must be replaced before real-value administration. This website update does not rotate authority, transfer funds or submit blockchain transactions.

See [PROTOCOL.md](PROTOCOL.md) for investment release gates.
