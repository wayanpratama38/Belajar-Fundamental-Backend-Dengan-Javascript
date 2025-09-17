import 'dotenv/config';
import * as amqplib from 'amqplib';
import Listener from "./listener.js";

const init = async() => {
    const listener = new Listener();
    const connection = await amqplib.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:playlist',{
        durable: true
    })

    channel.consume('export:playlist',listener.listen, {noAck : true});
}

init();