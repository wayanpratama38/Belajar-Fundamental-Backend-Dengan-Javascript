import * as amqp from 'amqplib'

export const ProducerService = {
    sendMessage : async(queue : string,message : string)=> {
        const connection = await amqp.connect(process.env.RABBITMQ_SERVER!!);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue,{
            durable: true
        })

        channel.sendToQueue(queue,Buffer.from(message));

        setTimeout(()=>{
            channel.close()
        },1000);
    }
}