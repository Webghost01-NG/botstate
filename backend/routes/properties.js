import express from 'express';
import { propertyService } from '../services/propertyService.js';
import { valuationService } from '../services/valuationService.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const properties = propertyService.getProperties(req.query);
    res.json({ properties });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const property = propertyService.getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Find comparable properties in the same region or price range
    const allProperties = propertyService.getProperties({});
    const comparables = allProperties
      .filter(p => p.id !== property.id && (
        p.country === property.country ||
        Math.abs(p.price - property.price) < property.price * 0.3
      ))
      .slice(0, 3);

    res.json({
      property,
      aiAnalysis: property.aiSummary,
      riskScore: property.riskScore,
      comparables
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/valuation', async (req, res, next) => {
  try {
    const valuationData = await valuationService.getValuation(req.params.id);
    res.json(valuationData);
  } catch (error) {
    if (error.message === 'Property not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

export default router;
