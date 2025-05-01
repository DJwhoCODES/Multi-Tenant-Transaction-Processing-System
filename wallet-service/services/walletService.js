require('dotenv').config()
const mongoose = require('mongoose');
const WalletSchema = require('../models/walletModel');

// Cache for DB connections
const connectionCache = {};

const getUserDbConnection = async (userId) => {
    const dbName = `sparkup_${userId}`;
    if (connectionCache[dbName]) return connectionCache[dbName];

    const conn = await mongoose.createConnection(`${process.env.MONGO_URI}/${dbName}`);

    connectionCache[dbName] = conn;
    return conn;
};

const getWalletModel = async (userId) => {
    const conn = await getUserDbConnection(userId);
    return conn.models.Wallet || conn.model('Wallet', WalletSchema);
};

exports.createWalletForUser = async (walletData) => {
    try {
        const WalletModel = await getWalletModel(walletData.userId);
        return await WalletModel.create(walletData);
    } catch (error) {
        console.log(error.message);
    }
};

exports.topUpWallet = async (userId, amount) => {
    try {
        const WalletModel = await getWalletModel(userId);
        const wallet = await WalletModel.findOne({ userId });
        if (!wallet) throw new Error('Wallet not found');

        const leanDeducted = Math.min(wallet.lean, amount);
        wallet.lean -= leanDeducted;
        wallet.balance += (amount - leanDeducted);

        await wallet.save();
        return { message: 'Top-up successful', wallet };
    } catch (error) {
        console.log(error.message);
    }
};

exports.validateWallet = async (userId, amount) => {
    const WalletModel = await getWalletModel(userId);
    const wallet = await WalletModel.findOne({ userId });
    if (!wallet) throw new Error('Wallet not found');

    const available = wallet.balance - wallet.hold;

    if (amount < wallet.minLimit) throw new Error('Amount below min limit');
    if (amount > wallet.maxLimit) throw new Error('Amount above max limit');
    if (available < amount) throw new Error('Insufficient balance');

    return true;
};

exports.deductFromWallet = async (userId, amount) => {
    const WalletModel = await getWalletModel(userId);
    const wallet = await WalletModel.findOne({ userId });
    if (!wallet) throw new Error('Wallet not found');

    const available = wallet.balance - wallet.hold;
    if (available < amount) throw new Error('Insufficient balance');

    const prevBalance = wallet.balance;
    wallet.balance -= amount;
    await wallet.save();

    return {
        message: 'Deduction successful',
        prevBalance,
        updatedBalance: wallet.balance,
        wallet
    };
};
