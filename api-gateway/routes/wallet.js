const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

router.post('/topup', authMiddleware, async (req, res) => {
    try {
        const response = await axios.post(`${process.env.WALLET_URL}/topup`, req.body);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Wallet Service Error' });
    }
});

module.exports = router;
