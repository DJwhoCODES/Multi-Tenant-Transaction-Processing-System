const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const response = await axios.post(`${process.env.USER_SERVICE_URL}/create-user`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
            message: error.message
        });
    }
});

module.exports = router;
