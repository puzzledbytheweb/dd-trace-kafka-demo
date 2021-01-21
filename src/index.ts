import { tracer } from './tracer';

import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: `kafkajs-test`,
  brokers: ['localhost:9092'],
});

const produceStuff = async () => {
  const producer = kafka.producer();
  await producer.connect();
  const metadata = await producer.send({
    messages: [
      { value: 'Back', key: `key-${Math.random() * 10}` },
      { value: 'to', key: `key-${Math.random() * 10}` },
      { value: 'the', key: `key-${Math.random() * 10}` },
      {
        value: 'FUUUUUUuuuuuuuuuutttttttttuuuuuuuuuuuuure!!',
        key: `key-${Math.random() * 10}`,
      },
    ],
    topic: 'test-topic',
  });

  console.log('Sent the Messages!!', metadata);
};

const consumeStuff = async () => {
  const consumer = kafka.consumer({ groupId: 'test-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic' });
  consumer.run({
    eachMessage: async m => {
      const currentSpan = tracer.scope().active();

      currentSpan?.addTags({
        'custom-tag': 'YOLO',
        // component: 'castle'
      });
      console.log('MESSAGE!!!! ------->', m.message.value?.toString());
    },
  });
};

consumeStuff();
setTimeout(() => produceStuff(), 10000);
