# Protocol repair and release gates

## Shipped website behavior

- Mainnet chain 677 is the read-only portfolio source. RPC failures display unavailable state rather than zero or sample balances.
- Holdings are read from tokens mapped by active registry properties, at one block. Unregistered/inactive assets are outside this scan; more than 100 active records fails explicitly.
- Deployment records are marked confirmed only after the exact successful creation receipt and deployed code presence are checked. This does not prove audited source correspondence.
- Missing catalog IDs return 404. Catalog entries and yields are illustrative.
- Real-investment pages do not submit payment transactions, registration fees or valuation signatures. `/deploy` and `/judge` prepare explicit MetaMask-confirmed zero-value deployment/setup/sample-claim transactions; users pay network gas.
- Wallet connection requires a real provider; account rejection and chain-switch failures propagate.

## Contract source repairs (not deployed)

- Dividend funding allocates per-share entitlements. Claims use checks-effects-interactions and a reentrancy guard. Transfers preserve already accrued claims. Rounding dust stays in the token contract; no fixed APY is promised.
- Signed valuation submission uses EIP-712 domain BOTSTATE_VALUATION_ORACLE version 2, the actual chain ID and contract address. Struct: ValuationAttestation(uint256 propertyId,uint256 valuation,uint256 nonce,uint256 deadline). A nonce is consumed only after valid signer verification. Rotating agents invalidates pending nonces for the outgoing and incoming signer.
- Legacy agent-authorized direct logging remains available and is not described as signature-verified.
- The EIP-712 domain is encoded explicitly using the standard domain type, chain ID and verifying contract, retaining Solidity 0.8.20 and the original EVM target. Runtime correspondence must be established before any new deployment.

## Before enabling investments

1. Rotate exposed signing/administrative authority through an explicitly authorized on-chain operation. Git history remains public; deleting the old key is not rotation.
2. Independently review and deploy the successor contracts; record constructor inputs, runtime hashes and receipts. Determine migration/recovery for any old token funding.
3. Establish verified property data and enforceable asset rights. Implement authorized registry and factory calls with matching confirmed events.
4. Connect purchases to Marketplace.buyTokens(listingId, amount), use integer token units and on-chain price, and verify Sold and ERC-20 Transfer events. Never use plain native transfers.
5. Verify real wallet workflows, dividend claims, signer rotation, adversarial transfers and chain/RPC failures. No deadline overrides these gates.

This release mitigates unsafe public behavior and repairs successor source. It does not establish a production-ready investment protocol or independent security audit.
