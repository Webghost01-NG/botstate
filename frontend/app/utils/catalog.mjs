export function sampleValuation(property) {
  return { propertyId: property.id, propertyName: property.name, mode: 'sample',
    valuation: { currentListingUSD: property.price, appraisedValueUSD: null },
    methodology: 'Sample catalog input only. No independent appraisal has been performed.',
    confidence: null, eip712Attestation: null, signingEnabled: false };
}
export function catalogReply(message, properties) {
  if (typeof message !== 'string' || !message.trim() || message.length > 2000) throw new Error('Enter a message of 1–2000 characters.');
  const query = message.toLowerCase();
  if (/wallet|balance|funds/.test(query)) return { reply: 'I cannot read your wallet balance from chat. Open Portfolio for a live mainnet RPC read. No sample balance is substituted.', properties: [] };
  let matches = properties.filter(p => query.includes(p.country.toLowerCase()) || query.includes(p.location.toLowerCase()));
  if (!matches.length) matches = [...properties];
  if (/yield|return/.test(query)) matches.sort((a,b) => b.yield-a.yield);
  if (/risk|safe/.test(query)) matches.sort((a,b) => a.riskScore-b.riskScore);
  return { reply: 'Sample entries selected by a rule-based filter. Prices, risk scores and yields are illustrative, not verified appraisals or promised returns. Purchases and registration are currently unavailable.', properties: matches.slice(0,3) };
}
