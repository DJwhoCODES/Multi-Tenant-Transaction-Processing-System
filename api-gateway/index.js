require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const txnRoutes = require('./routes/transaction');
const serviceRoutes = require('./routes/service');
const walletRoutes = require('./routes/wallet');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => { res.send("Welcome To Multi-Tenant Transaction Processing System!") });
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/wallet', walletRoutes);
app.use('/service', serviceRoutes);
app.use('/transaction', txnRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
