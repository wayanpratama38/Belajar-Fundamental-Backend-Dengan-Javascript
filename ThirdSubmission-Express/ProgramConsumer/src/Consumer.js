import 'dotenv/config';
import amqp from 'amqplib';
import Listener from './Listener.js';
import PlaylistService from './PlaylistService.js';
import MailService from './MailService.js';


const init = async() => {
 const queue = 'export:playlists'
 const playlistService = new PlaylistService();
 const mailService = new MailService();
 const listener = new Listener(playlistService,mailService)

 
 const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
 const channel = await connection.createChannel();
 
 await channel.assertQueue(queue,{
  durable : true
 });
 
 channel.consume(queue,listener.listen,{noAck : true})
}


init();
