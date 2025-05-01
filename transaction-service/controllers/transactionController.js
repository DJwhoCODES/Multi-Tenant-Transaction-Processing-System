const transactionService = require('../services/transactionService');

exports.initiateTransaction = async (req, res) => {
    try {
        const result = await transactionService.processTransaction(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
