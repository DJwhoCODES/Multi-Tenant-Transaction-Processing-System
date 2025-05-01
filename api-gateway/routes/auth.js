const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.post('/login', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/login`, req.body);
        res.json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message || 'Something went wrong';

        res.status(status).json({ message });
    }
});

module.exports = router;
