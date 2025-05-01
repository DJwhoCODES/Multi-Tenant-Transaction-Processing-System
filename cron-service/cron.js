require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');
const SharedUserModel = require('./models/userModel');
const transactionSchema = require('./models/transactionSchema');

const connectionCache = {};

const getUserDbConnection = async (userId) => {
    const dbName = `sparkup_${userId}`;
    if (connectionCache[dbName]) return connectionCache[dbName];

    const conn = await mongoose.createConnection(`${process.env.MONGO_URI}/${dbName}`);

    connectionCache[dbName] = conn;
    return conn;
};

// CRON JOB: Runs every 1 minute
cron.schedule('* * * * *', async () => {
    console.log('🕐 Cron job running...');

    try {
        const users = await SharedUserModel.find({});
        const promises = users.map(async ({ userId }) => {
            try {
                const conn = await getUserDbConnection(userId);
                const Transaction = conn.models.Transaction || conn.model('Transaction', transactionSchema);

                const result = await Transaction.updateMany(
                    { status: 'awaited' },
                    { $set: { status: 'success' } }
                );

                return `[${userId}] Updated ${result.modifiedCount} transactions to success`;
            } catch (err) {
                return `❌ Error for user ${userId}: ${err.message}`;
            }
        });

        const results = await Promise.all(promises);
        results.forEach(msg => console.log(msg));

    } catch (err) {
        console.error('❌ Cron job error:', err.message);
    }
});
