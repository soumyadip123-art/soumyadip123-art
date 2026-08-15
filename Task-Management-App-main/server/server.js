import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './src/routes/taskRoutes.js';
import connectDB from './src/config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: '*', // For development only
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection

connectDB();

// ✅ 4. Test Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});


// Routes
app.use('/api/tasks', taskRoutes);


// ✅ 6. Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});
// ✅ 7. 404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`📡 Test API: http://localhost:${PORT}/api/health`);
    console.log(`📋 Tasks API: http://localhost:${PORT}/api/tasks`);
});