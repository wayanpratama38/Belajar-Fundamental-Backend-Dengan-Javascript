import * as amqp from 'amqplib';

// Still using dicoding code for example
export const ExportService = {
    sendMessage : async (queue,message) => {
        const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
        const channel = await connection.createChannel();

        await channel.assertQueue(queue,{
            durable : true
        })

        channel.sendToQueue(queue,Buffer.from(message));
    }
}
