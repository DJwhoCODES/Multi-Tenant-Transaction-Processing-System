const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    userId: String,
});

exports.createUserDbAndModel = async (dbName) => {
    const db = mongoose.createConnection(`${process.env.MONGO_URI}/${dbName}`);

    const UserModel = db.model('User', userSchema);
    return { db, UserModel };
};
