const mongoose = require('mongoose');
const connectionCache = {};

exports.getUserDbConnection = async (dbName) => {
    if (connectionCache[dbName]) return connectionCache[dbName];

    const conn = await mongoose.createConnection(`${process.env.MONGO_URI}/${dbName}`);

    connectionCache[dbName] = conn;
    return conn;
};
