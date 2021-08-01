const { Kafka, logLevel } = require("kafkajs");
const processMessage = require("./processMessage");

class KafkaConsumer {
    #kafkaInstance;
    #kafkaConsumer;
    constructor() {
        const brokerHost = process.env.KAFKA_BROKER;
        this.#kafkaInstance = new Kafka({
            clientId: "my-app-consumer",
            brokers: [brokerHost],
            logLevel: logLevel.NOTHING,
            retry: {
                retries: 2,
                initialRetryTime: 8000,
                maxRetryTime: 12000,
                factor: 3,
                multiplier: 3,
            },
            requestTimeout: 25000,
        });

        const { KAFKA_GROUP } = process.env;
        this.#kafkaConsumer = this.#kafkaInstance.consumer({
            groupId: KAFKA_GROUP,
            retry: {
                restartOnFailure: async () => {
                    console.log('   Restarting connection with Kafka');
                    return true;
                }
            }
        });
        const topicName = process.env.TOPIC_NAME;
        this.#kafkaConsumer
            .connect()
            .then(() => {
                console.log(`Consumer connected`);
            })
            .catch(() => console.log("Something wrong happened to trying connect consumer"));
        this.#kafkaConsumer
            .subscribe({ topic: topicName, fromBeginning: true })
            .then(() => {
                console.log("Consumer subscribed");
            })
            .catch((err) => {
                console.log(
                    `Something wrong happened to trying subscribe consumer at topic ${topicName} - ${err}`
                );
            });
    }

    async receiveMessage() {
        try {
            await this.#kafkaConsumer.run({
                eachMessage: async ({ message, topic, partition }) => {
                    // console.log(message);
                    console.log(`Trying read message ${message.offset} ${new Date().toISOString()}`)
                    await processMessage.execute({
                        stringMessage: message.value,
                        offset: message.offset,
                        topic,
                        partition,
                    });
                },
            });
        } catch (err) {
            console.log('err', err)
        }
    }

    async disconnect() {
        console.log('Disconnecting consumer');
        await this.#kafkaConsumer.disconnect();
        console.log('Consumer disconnected');
    }
}

module.exports = new KafkaConsumer();
