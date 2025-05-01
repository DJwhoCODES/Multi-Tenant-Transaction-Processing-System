require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/dummy', (req, res) => {
    const { transactionId, amount } = req.body;
    console.log(`Dummy API received: txnId=${transactionId}, amount=${amount}`);
    return res.json({ status: 'acknowledged' });
});

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => console.log(`Dummy Bank API running on port ${PORT}`));
