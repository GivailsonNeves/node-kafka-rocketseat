import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'certificate',
});

const topic = 'issue-certificate';
const consumer = kafka.consumer({ groupId: 'certificate-group' });

const producer = kafka.producer();

let counter = 0;

async function run() {
    await consumer.connect();
    await producer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
            console.log(`- ${prefix} ${message.topicName}#${message.value}`)
            
            const payload = JSON.parse(message.value);
            
            setTimeout(() => {
                counter++;
                producer.send({
                    topic: 'certification-response',
                    messages: [
                        {
                            value: `#${message.offset} Certificado #${counter} gerado - ${payload.user.name}`
                        }
                    ]
                })
            }, 2000);
        },
    })
}

run().catch(console.error);