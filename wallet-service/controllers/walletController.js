const walletService = require('../services/walletService');

exports.createWallet = async (req, res) => {
    try {
        const wallet = await walletService.createWalletForUser(req.body);
        res.status(201).json(wallet);
    } catch (err) {
        res.status(500).json({ message: 'Wallet creation failed' });
    }
};

exports.topUpWallet = async (req, res) => {
    try {
        const result = await walletService.topUpWallet(req.body.userId, req.body.amount);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.validateWallet = async (req, res) => {
    try {
        const result = await walletService.validateWallet(req.body.userId, req.body.amount);
        res.json({ valid: result });
    } catch (err) {
        res.status(400).json({ valid: false, message: err.message });
    }
};

exports.deductFromWallet = async (req, res) => {
    try {
        const result = await walletService.deductFromWallet(req.body.userId, req.body.amount);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
