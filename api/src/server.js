import express from 'express';
import { Kafka, logLevel } from 'kafkajs';
import routes from './routes';

const app = express();

const kafka = new Kafka({
    clientId: 'api',
    brokers: ['localhost:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'certificate-group-receiver' });

app.use((req, res, next) => {
    req.producer = producer;
    return next();
});

app.use(routes)

const run = async () => {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({ topic: 'certification-response' });
    consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log('response', message.value.toString());
        }
    })
    app.listen(3333);
}

run().catch(console.error);