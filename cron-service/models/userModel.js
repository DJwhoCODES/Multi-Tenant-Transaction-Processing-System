require('dotenv').config();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    dbName: { type: String, required: true }
});

const mongoUri = process.env.MONGO_URI;

const sharedConnection = mongoose.createConnection(`${mongoUri}/Shared`);

sharedConnection.on('connected', () => {
    console.log('Connected to Shared DB');
});

sharedConnection.on('error', (err) => {
    console.error('Shared DB connection error:', err);
});

const UserModel = sharedConnection.model('User', userSchema);

module.exports = UserModel;
