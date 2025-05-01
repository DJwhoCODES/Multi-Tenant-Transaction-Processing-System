const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.post('/login', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/login`, req.body);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Auth service error' });
    }
});

module.exports = router;
