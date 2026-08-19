import express from 'express';
import { agentService } from '../services/agentService.js';

const router = express.Router();

router.get('/profile', (req, res, next) => {
  try {
    const profile = agentService.getProfile();
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

router.get('/actions', (req, res, next) => {
  try {
    const actions = agentService.getActions();
    res.json(actions);
  } catch (error) {
    next(error);
  }
});

export default router;
