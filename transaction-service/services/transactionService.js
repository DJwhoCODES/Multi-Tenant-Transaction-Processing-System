require('dotenv').config();
const amqp = require('amqplib');

exports.processTransaction = async ({ userId, serviceId, amount }) => {
    try {
        const conn = await amqp.connect(process.env.RABBITMQ_URL);

        const channel = await conn.createChannel();

        await channel.assertQueue(process.env.QUEUE_NAME);

        const payload = { userId, serviceId, amount };
        await channel.sendToQueue(process.env.QUEUE_NAME, Buffer.from(JSON.stringify(payload)));
        console.log("Transaction initiated successfully!");
        return {
            message: 'Transaction request queued successfully',
            payload
        };
    } catch (err) {
        throw new Error('Failed to queue transaction: ' + err.message);
    }
};
