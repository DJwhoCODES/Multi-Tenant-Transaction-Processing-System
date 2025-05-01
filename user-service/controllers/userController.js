const { createUserDbAndModel } = require('../services/dbService');
const { getSharedUserModel } = require('../utils/dbHelper');
const axios = require('axios');


exports.createUser = async (req, res) => {
    const { name, email, mobile, userId } = req.body;
    const dbName = `sparkup_${userId}`;

    try {
        const SharedUserModel = await getSharedUserModel();

        const existing = await SharedUserModel.findOne({ userId });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const { db, UserModel } = await createUserDbAndModel(dbName);
        const user = await UserModel.create({ name, email, mobile, userId });

        await SharedUserModel.create({ userId, dbName });

        const walletData = {
            userId,
            balance: 10000,
            hold: 100,
            minLimit: 50,
            maxLimit: 5000,
            lean: 200
        };

        await axios.post(`${process.env.WALLET_SERVICE_URL}`, walletData);

        res.status(201).json({ message: 'User created successfully', dbName });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'User creation failed' });
    }
};
