
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import auctionRoutes from './routes/auctionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { setIO } from './lib/socket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
// CORS configuration for production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:3001'];

// In development, allow all origins; in production, use allowedOrigins
const isDevelopment = process.env.NODE_ENV !== 'production';

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin && isDevelopment) return callback(null, true);
        
        // In development, allow all origins
        if (isDevelopment) return callback(null, true);
        
        // In production, check against allowed origins
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`CORS: Blocked origin: ${origin}`);
            callback(null, true); // For now, allow all - update to callback(new Error(...)) for strict CORS
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type']
};

const io = new Server(httpServer, {
    cors: corsOptions
});

// Set Socket.io instance for use in routes
setIO(io);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auction', auctionRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('PPL Auction API is running');
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
