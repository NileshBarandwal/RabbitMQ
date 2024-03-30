const amqp = require('amqplib');

async function consumeMessages() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'message_queue';

  await channel.assertQueue(queue, { durable: false });

  console.log('Waiting for messages...');

  channel.consume(queue, (message) => {
    console.log('Received:', message.content.toString());
  }, { noAck: true });
}

consumeMessages().catch(console.error);
