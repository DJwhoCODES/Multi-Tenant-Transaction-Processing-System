const mongoose = require('mongoose');

let sharedConnection = null;
let isConnecting = false;

const getSharedDbConnection = async () => {
    if (sharedConnection) return sharedConnection;
    if (isConnecting) {
        // Wait until another ongoing connection completes
        while (isConnecting) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return sharedConnection;
    }

    isConnecting = true;

    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('Invalid MongoDB URI. Please check the connection string.');
            return null;
        }

        const conn = await mongoose.connect(`${mongoUri}/Shared`);
        console.log("Shared DB Connected Successfully!");
        sharedConnection = conn;
        return sharedConnection;
    } catch (err) {
        console.error('Failed to connect to shared DB:', err.message || err);
        return null;
    } finally {
        isConnecting = false;
    }
};

const sharedUserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    dbName: { type: String, required: true },
});

const getSharedUserModel = async () => {
    const conn = await getSharedDbConnection();
    if (!conn) {
        console.error('Unable to retrieve user model. Database connection failed.');
        return null;  // Return null to indicate failure
    }
    return conn.models.User || conn.model('User', sharedUserSchema);
};

module.exports = {
    getSharedDbConnection,
    getSharedUserModel,
};
