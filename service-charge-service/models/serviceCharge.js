const mongoose = require('mongoose');

const serviceChargeSchema = new mongoose.Schema({
    userId: String,
    serviceId: String,
    slabs: String,
});

module.exports = serviceChargeSchema;
