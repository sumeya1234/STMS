require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'STMS API is running' });
});

// TODO: Plug in routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/assignments', require('./src/routes/assignments'));
app.use('/api/tasks', require('./src/routes/tasks'));
app.use('/api/analytics', require('./src/routes/analytics'));
app.use('/api/courses', require('./src/routes/courses'));
app.use('/api/submissions', require('./src/routes/submissions'));

const pool = require('./src/config/db');
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
    try {
        await pool.query('SELECT 1');
        console.log('Successfully connected to the database!');
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
    }
});
