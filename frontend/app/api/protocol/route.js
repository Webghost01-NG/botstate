import { deploymentEvidence } from '../../utils/chain.mjs';
export const dynamic = 'force-dynamic';
export async function GET() {
  try { return Response.json({ release: 'verified-flows-v1', chainId: 677, writesEnabled: false, records: await deploymentEvidence() }); }
  catch { return Response.json({ release: 'verified-flows-v1', chainId: 677, writesEnabled: false, error: 'Mainnet verification unavailable. No records are marked confirmed.' }, { status: 503 }); }
}
