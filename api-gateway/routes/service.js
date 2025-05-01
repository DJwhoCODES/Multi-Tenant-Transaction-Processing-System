const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

router.post('/assign', authMiddleware, async (req, res) => {
    try {
        const response = await axios.post(`${process.env.SERVICE_CHARGE_URL}/assign`, req.body);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Service Charge Error' });
    }
});

module.exports = router;
