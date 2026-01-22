import amq from 'amqplib';

const ExportRepositories = {
  // eslint-disable-next-line camelcase
  async exportPlaylist(playlist_id, target_email) {
    const queue = 'export:playlists';
    const connection = await amq.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    const message = {
      // eslint-disable-next-line camelcase
      playlistId: playlist_id,
      // eslint-disable-next-line camelcase
      targetEmail: target_email,
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

export default ExportRepositories;
