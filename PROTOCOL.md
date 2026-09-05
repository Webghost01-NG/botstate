# Protocol repair and release gates

## Shipped website behavior

- Mainnet chain 677 is the read-only portfolio source. RPC failures display unavailable state rather than zero or sample balances.
- Holdings are read from tokens mapped by active registry properties, at one block. Unregistered/inactive assets are outside this scan; more than 100 active records fails explicitly.
- Core deployment records are marked confirmed only after the exact successful creation receipt and compiled runtime hash are checked. All six setup transactions and five runtimes can be rechecked with `node frontend/scripts/verifyActiveDeployment.mjs`. This is not an independent audit.
- Missing catalog IDs return 404. Catalog entries and yields are illustrative.
- Real-investment pages do not submit payment transactions, registration fees or valuation signatures. `/judge` and `/properties/900001` prepare explicit MetaMask-confirmed zero-value sample claims; users pay network gas. Demo, Proof and Deploy routes are removed.
- Wallet connection requires a real provider; account rejection and chain-switch failures propagate.

## Deployed contract repairs

The six mainnet setup transactions are confirmed and linked in README.md. The active registry and factory now include fictional sample property 900001 and SAMPLE-RWA. This updates website references; it does not migrate or modify earlier contracts.

- Dividend funding allocates per-share entitlements. Claims use checks-effects-interactions and a reentrancy guard. Transfers preserve already accrued claims. Rounding dust stays in the token contract; no fixed APY is promised.
- Signed valuation submission uses EIP-712 domain BOTSTATE_VALUATION_ORACLE version 2, the actual chain ID and contract address. Struct: ValuationAttestation(uint256 propertyId,uint256 valuation,uint256 nonce,uint256 deadline). A nonce is consumed only after valid signer verification. Rotating agents invalidates pending nonces for the outgoing and incoming signer.
- Legacy agent-authorized direct logging remains available and is not described as signature-verified.
- The EIP-712 domain is encoded explicitly using the standard domain type, chain ID and verifying contract, retaining Solidity 0.8.20 and the original EVM target. Runtime correspondence must be established before any new deployment.

## Before enabling investments

1. Rotate exposed signing/administrative authority through an explicitly authorized on-chain operation. Git history remains public; deleting the old key is not rotation.
2. Independently review the deployed successor contracts and test real-value workflows. Runtime hashes and receipts are recorded, but are not an audit. Determine migration/recovery for any old token funding.
3. Establish verified property data and enforceable asset rights. Implement authorized registry and factory calls with matching confirmed events.
4. Connect purchases to Marketplace.buyTokens(listingId, amount), use integer token units and on-chain price, and verify Sold and ERC-20 Transfer events. Never use plain native transfers.
5. Verify real wallet workflows, dividend claims, signer rotation, adversarial transfers and chain/RPC failures. No deadline overrides these gates.

This release activates verified sample deployments and retains explicit sample-only labeling. It does not establish a production-ready investment protocol or independent security audit. No sample claim was submitted by the release tooling; users sign their own claims.
