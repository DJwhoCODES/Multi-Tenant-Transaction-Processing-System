require('dotenv').config();
const mongoose = require('mongoose');
const connectConsumer = require('./consumers/consumer');

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Queue DB connected');
        connectConsumer();
    })
    .catch(err => console.error('Queue DB error:', err));
