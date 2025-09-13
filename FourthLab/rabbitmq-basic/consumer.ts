import * as amqp from 'amqplib';

const init = async() =>{
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queue = 'dicoding';

    await channel.assertQueue(queue,{
        durable : true
    });

    channel.consume(queue,(message) => {
        console.log(message);
        console.log(`Message dari ${queue} : ${message?.content.toString()}`)
    }, {noAck : true});
}

init();