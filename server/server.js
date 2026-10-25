const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Neon Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test API
app.get('/', (req, res) => {
    res.send("Backend is Running Perfectly!");
});

// Telegram Auth API (Simplified for now)
app.post('/api/login', async (req, res) => {
    try {
        const { telegramId, name, referrerId } = req.body;
        
        // Check if user exists
        let result = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
        
        if (result.rows.length === 0) {
            // New User -> Insert into DB
            result = await pool.query(
                'INSERT INTO users (telegram_id, name, balance, referrer_id) VALUES ($1, $2, $3, $4) RETURNING *',
                [telegramId, name, 0, referrerId || null]
            );
        }
        
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Balance
app.get('/api/balance/:telegramId', async (req, res) => {
    try {
        const { telegramId } = req.params;
        const result = await pool.query('SELECT balance FROM users WHERE telegram_id = $1', [telegramId]);
        
        if (result.rows.length > 0) {
            res.json({ balance: result.rows[0].balance });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
