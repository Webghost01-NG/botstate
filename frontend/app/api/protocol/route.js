import { deploymentEvidence } from '../../utils/chain.mjs';
import deployment from '../../data/active-deployment.json';
export const dynamic = 'force-dynamic';
export async function GET() {
  try { return Response.json({ release: deployment.release, chainId: 677, writesEnabled: false, sampleClaimsEnabled: true, sample: deployment.sample, records: await deploymentEvidence() }); }
  catch { return Response.json({ release: deployment.release, chainId: 677, writesEnabled: false, error: 'Mainnet verification unavailable. No records are marked confirmed.' }, { status: 503 }); }
}
