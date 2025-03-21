import express from 'express';
import cors from 'cors';
import './config/database.js';
import userRoutes from './routes/userRoutes.js';
import emissionRoutes from './routes/emissionRoutes.js';
import sinkRoutes from './routes/sinkRoutes.js';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/emissions', emissionRoutes);
app.use('/api/sinks', sinkRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🔍 Health check requested');
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log('📝 Available endpoints:');
  console.log('  - GET /health: Check server status');
  console.log('  - POST /api/users/register: Register a new user');
  console.log('  - POST /api/emissions: Create emission record');
  console.log('  - GET /api/emissions/user/:userId: Get user\'s emissions');
  console.log('  - PUT /api/emissions/:id: Update emission record');
  console.log('  - DELETE /api/emissions/:id: Delete emission record');
  console.log('  - POST /api/sinks: Create sink project');
  console.log('  - GET /api/sinks/user/:userId: Get user\'s sink projects');
  console.log('  - PUT /api/sinks/:id: Update sink project');
  console.log('  - DELETE /api/sinks/:id: Delete sink project');
});
