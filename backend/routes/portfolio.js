import express from 'express';
import { blockchainService } from '../services/blockchainService.js';

const router = express.Router();

router.get('/:address', async (req, res, next) => {
  try {
    const portfolio = await blockchainService.getUserPortfolio(req.params.address);
    res.json(portfolio);
  } catch (error) {
    next(error);
  }
});

export default router;
