const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    balance: Number,
    hold: Number,
    minLimit: Number,
    maxLimit: Number,
    lean: Number,
});

module.exports = WalletSchema;
