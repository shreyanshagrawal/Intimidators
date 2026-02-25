import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import tenderRoutes from './routes/tender.js';
import websiteRoutes from './routes/website.js';
import leadRoutes from './routes/lead.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173',
    'https://intimidator-8u3j.vercel.app'
    ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/leads', leadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files from frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
  
  // Only serve index.html for non-API routes
}

// 404 handler for undefined API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      success: false, 
      message: `API endpoint not found: ${req.path}` 
    });
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV !== 'production' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  HPCL Lead Intelligence Agent Server                     ║
╠══════════════════════════════════════════════════════════╣
║  Status: Running                                         ║
║  Port: ${PORT}                                             ║
║  Environment: ${process.env.NODE_ENV || 'development'}                              ║
║  API Base: http://localhost:${PORT}/api                    ║
║  Health Check: http://localhost:${PORT}/api/health         ║
╚══════════════════════════════════════════════════════════╝
  `);
});
