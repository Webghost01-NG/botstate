import express from 'express';
import { aiService } from '../services/aiService.js';
import { propertyService } from '../services/propertyService.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const properties = propertyService.getProperties();
    const aiResponse = await aiService.chat(message, conversationHistory, properties);
    
    res.json(aiResponse);
  } catch (error) {
    next(error);
  }
});

export default router;
