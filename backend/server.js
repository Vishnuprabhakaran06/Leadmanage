require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const leadRoutes = require('./routes/leadRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────────────────────────

// CORS — allow any localhost / 127.0.0.1 origin (Vite may pick 5173, 5174, etc.)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'https://lead-management-system-bixk.onrender.com', // deployed frontend
      ];

      // Allow any localhost or 127.0.0.1 origin (for local dev)
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

      if (isLocalhost || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS not allowed for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  })
);
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────────────────────────

app.use('/api/leads', leadRoutes);
app.use('/api/employees', employeeRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Centralized error handling ─────────────────────────────────────────────────
// No raw stack traces returned to the client.
app.use((err, _req, res, _next) => {
  console.error('Server error:', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = {};
    for (const field of Object.keys(err.errors)) {
      errors[field] = err.errors[field].message;
    }
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error.',
  });
});

// ─── Start ──────────────────────────────────────────────────────────────────────

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  });
});
