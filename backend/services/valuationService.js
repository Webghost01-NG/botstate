import { propertyService } from './propertyService.js';
export class ValuationService {
  async getValuation(propertyId) {
    const property = propertyService.getPropertyById(propertyId);
    if (!property) throw new Error('Property not found');
    return { propertyId, mode: 'sample', valuation: { currentListingUSD: property.price, appraisedValueUSD: null }, confidence: null, methodology: 'Sample catalog input; no independent appraisal.', signingEnabled: false, eip712Attestation: null };
  }
}
export const valuationService = new ValuationService();
