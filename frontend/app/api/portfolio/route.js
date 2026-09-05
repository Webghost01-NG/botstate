import { isAddress } from 'ethers';
import { readPortfolio } from '../../utils/chain.mjs';
export async function GET(request) {
  const address = new URL(request.url).searchParams.get('address');
  if (!address || !isAddress(address)) return Response.json({ error: 'Invalid wallet address.' }, { status: 400 });
  try { return Response.json(await readPortfolio(address)); }
  catch { return Response.json({ error: 'Portfolio could not be verified from mainnet. Retry later; no balances or holdings have been substituted.' }, { status: 503 }); }
}
