const amqp = require('amqplib');
const readline = require('readline');

async function publishMessages() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'message_queue';

  await channel.assertQueue(queue, { durable: false });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt('Enter message (or "exit" to quit): ');
  rl.prompt();

  rl.on('line', async (input) => {
    if (input.trim().toLowerCase() === 'exit') {
      rl.close();
      await connection.close();
      process.exit(0);
    } else {
      const message = input.trim();
      channel.sendToQueue(queue, Buffer.from(message));
      console.log('Sent:', message);
      rl.prompt();
    }
  });
}

publishMessages().catch(console.error);
