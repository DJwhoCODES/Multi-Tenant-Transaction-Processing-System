const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

router.post('/topup', authMiddleware, async (req, res) => {
    try {
        const response = await axios.post(`${process.env.WALLET_URL}/topup`, req.body);
        res.json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message || 'Something went wrong';

        res.status(status).json({ message });
    }
});

module.exports = router;
