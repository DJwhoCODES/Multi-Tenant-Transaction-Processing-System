require('dotenv').config();
const express = require('express');
const transaction = require('./controllers/transactionController');

const app = express();
app.use(express.json());

app.post('/transaction/initiate', transaction.initiateTransaction);

app.listen(process.env.PORT, () => console.log(`Transaction Service running on port ${process.env.PORT}`));
