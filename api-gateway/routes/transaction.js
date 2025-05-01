const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

router.post('/initiate', authMiddleware, async (req, res) => {
    try {
        const response = await axios.post(`${process.env.TRANSACTION_SERVICE_URL}/initiate`, req.body);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Transaction service error' });
    }
});

module.exports = router;
