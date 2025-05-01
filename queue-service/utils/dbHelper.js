require('dotenv').config();
const mongoose = require('mongoose');

// Cache to store user-specific DB connections
const connectionCache = {};

exports.getUserDbConnection = async (userId) => {
    const dbName = `sparkup_${userId}`;
    if (connectionCache[dbName]) return connectionCache[dbName];

    const conn = await mongoose.createConnection(`${process.env.MONGO_URI}/${dbName}`);

    connectionCache[dbName] = conn;
    return conn;
};
