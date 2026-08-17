import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { CONSTANTS } from './utils/constants.js';

// Route imports
import chatRoutes from './routes/chat.js';
import propertiesRoutes from './routes/properties.js';
import portfolioRoutes from './routes/portfolio.js';
import agentRoutes from './routes/agent.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || CONSTANTS.DEFAULT_PORT;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/agent', agentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', agent: 'BOTSTATE API Running' });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 BOTSTATE AI Agent backend running on port ${PORT}`);
  console.log(`🔗 Blockchain RPC: ${process.env.BOT_CHAIN_RPC || 'Not Set'}`);
});
