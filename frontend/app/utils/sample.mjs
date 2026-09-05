import deployment from '../data/active-deployment.json' with { type: 'json' };

export const sampleAsset = {
  id: String(deployment.sample.propertyId),
  name: 'BOTSTATE Sample Residence',
  isSampleAsset: true,
  chainId: deployment.chainId,
  token: deployment.sample.address,
  price: null,
  yield: null,
  notice: 'SAMPLE ONLY: no real property, ownership rights or promised returns',
  claimAmount: '10',
  symbol: 'SAMPLE-RWA',
  purchasesEnabled: false
};
