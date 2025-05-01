require('dotenv').config();
const express = require('express');
const walletController = require('./controllers/walletController');

const app = express();
app.use(express.json());

// Routes
app.post('/wallet', walletController.createWallet);
app.post('/wallet/topup', walletController.topUpWallet);
app.post('/wallet/validate', walletController.validateWallet);
app.post('/wallet/deduct', walletController.deductFromWallet);

app.listen(process.env.PORT, () => console.log(`Wallet Service running on port ${process.env.PORT}`));
