require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const chargeController = require('./controllers/chargeController');

const app = express();
app.use(express.json());

// Routes
app.post('/service/assign', chargeController.assignService);
app.post('/service/calculate', chargeController.calculateCharge);

app.listen(process.env.PORT, () => console.log(`Service Charge Service running on port ${process.env.PORT}`));
