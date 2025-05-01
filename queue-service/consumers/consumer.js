require('dotenv').config();
const amqp = require('amqplib');
const axios = require('axios');
const { getUserDbConnection } = require('../utils/dbHelper');
const transactionSchema = require('../models/transactionModel');

async function wait(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

async function connectToRabbitMQWithRetry() {
    let connection;
    const RABBITMQ_URL = process.env.RABBITMQ_URL.endsWith('/')
        ? process.env.RABBITMQ_URL
        : `${process.env.RABBITMQ_URL}/`;

    while (!connection) {
        try {
            console.log('Attempting to connect to RabbitMQ...');
            connection = await amqp.connect(RABBITMQ_URL);
            console.log('✅ Connected to RabbitMQ');
        } catch (err) {
            console.error(`❌ RabbitMQ connection failed: ${err.message}. Retrying in 5s...`);
            await wait(5000);
        }
    }

    return connection;
}

// ... (previous imports remain the same)

async function connectConsumer() {
    const conn = await connectToRabbitMQWithRetry();
    const channel = await conn.createChannel();
    await channel.assertQueue(process.env.QUEUE_NAME);

    console.log(`Queue Consumer listening on "${process.env.QUEUE_NAME}"`);

    channel.consume(process.env.QUEUE_NAME, async (msg) => {
        if (!msg) return;

        const payload = JSON.parse(msg.content.toString());
        console.log('Payload Received from queue:', payload);

        try {
            const { userId, serviceId, amount } = payload;

            // Step 1: Get service charge & GST
            console.log(`Requesting Service Charge from: ${process.env.SERVICE_CHARGE_URL}`);
            const { data: chargeData } = await axios.post(`${process.env.SERVICE_CHARGE_URL}`, {
                userId, serviceId, amount
            });
            console.log(`Service Charge Response:`, chargeData);

            const serviceCharge = parseFloat(chargeData.serviceCharge);
            const gst = parseFloat(chargeData.gst);
            const totalDebit = amount + serviceCharge + gst;

            // Step 2: Wallet Deduction
            console.log(`Requesting Wallet Deduction from: ${process.env.WALLET_URL}/wallet/deduct`);
            const { data: walletData } = await axios.post(`${process.env.WALLET_URL}/wallet/deduct`, {
                userId, amount: totalDebit
            });
            console.log(`Wallet Deduction Response:`, walletData);

            const { prevBalance, updatedBalance } = walletData;

            // Step 3: Save Transaction
            const userConn = await getUserDbConnection(userId);
            const Transaction = userConn.models.Transaction || userConn.model('Transaction', transactionSchema);

            let txn;
            try {
                txn = await Transaction.create({
                    amount,
                    serviceCharge,
                    gst,
                    userId,
                    prevBalance,
                    updatedBalance,
                    serviceId,
                    status: 'initiated'
                });
            } catch (error) {
                console.log("Error adding to DB!");
                throw error;
            }

            console.log("Transaction created!");

            // Step 4: Call Dummy API
            console.log(`Sending Transaction to Dummy API at: ${process.env.DUMMY_API}`);
            await axios.post(process.env.DUMMY_API, {
                transactionId: txn._id,
                amount
            });
            console.log("Transaction sent to dummy bank!");

            // Step 5: Update status to 'awaited'
            txn.status = 'awaited';
            await txn.save();

            console.log(`Transaction ${txn._id} processed and marked as awaited`);

            // Send success response back
            if (msg.properties.replyTo) {
                channel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(JSON.stringify({
                        success: true,
                        data: {
                            transactionId: txn._id,
                            status: 'awaited'
                        }
                    })),
                    { correlationId: msg.properties.correlationId }
                );
            }

            channel.ack(msg);
        } catch (err) {
            console.error('Transaction failed:', err?.response?.data?.message);
            if (err.response && err.response.status === 404) {
                console.error(`404 error occurred at URL: ${err.config.url}`);
            }

            // Send error response back
            if (msg.properties.replyTo) {
                channel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(JSON.stringify({
                        success: false,
                        error: err?.response?.data?.message
                    })),
                    { correlationId: msg.properties.correlationId }
                );
            }

            channel.ack(msg); // Still ack the message since we've handled it
        }
    });
}

module.exports = connectConsumer;
