import * as amqp from 'amqplib';


const init = async() => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    const queue = 'dicoding';
    const message = 'Lagi belajar message broker';

    await channel.assertQueue(queue,{
        durable : true
    });

    channel.sendToQueue(queue,Buffer.from(message));
    console.log('Pesan sudah terkirim');

    setTimeout(()=>{
        connection.close()
    },1000);
};

init();