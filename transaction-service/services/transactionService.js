require('dotenv').config();
const amqp = require('amqplib');
const uuid = require('uuid');

exports.processTransaction = async ({ userId, serviceId, amount }) => {
    try {
        const conn = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await conn.createChannel();

        // Create a temporary queue for responses
        const replyQueue = await channel.assertQueue('', { exclusive: true });
        const correlationId = uuid.v4();

        // Send the request
        const payload = { userId, serviceId, amount };
        await channel.sendToQueue(
            process.env.QUEUE_NAME,
            Buffer.from(JSON.stringify(payload)),
            {
                correlationId,
                replyTo: replyQueue.queue
            }
        );

        console.log("Transaction initiated, waiting for response...");

        // Wait for the response
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                channel.close();
                conn.close();
                reject(new Error('Transaction processing timed out'));
            }, 30000);

            channel.consume(replyQueue.queue, (msg) => {
                if (msg.properties.correlationId === correlationId) {
                    clearTimeout(timeout);
                    channel.close();
                    conn.close();

                    const response = JSON.parse(msg.content.toString());
                    if (response.success) {
                        resolve({
                            message: 'Transaction processed successfully',
                            payload: response.data
                        });
                    } else {
                        reject(new Error('Transaction failed: ' + response.error));
                    }
                }
            }, { noAck: true });
        });
    } catch (err) {
        throw new Error('Failed to process transaction: ' + err.message);
    }
};