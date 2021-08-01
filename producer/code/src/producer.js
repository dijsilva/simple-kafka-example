const { Kafka, CompressionTypes, logLevel } = require('kafkajs');

class KafkaProducer {
    #kafkaInstance
    #kafkaProducer
    #kafkaAdmin
    constructor() {
        this.topicName = process.env.TOPIC_NAME;
        const brokerHost = process.env.KAFKA_BROKER
        this.#kafkaInstance = new Kafka({
            clientId: 'my-app-producer',
            brokers: [ brokerHost ],
            logLevel: logLevel.ERROR,
        });

        this.#kafkaProducer = this.#kafkaInstance.producer();
    }

    async sendMessage(message) {
        console.log(`Sending message to topic ${this.topicName}`);
        await this.#kafkaProducer.connect();
        await this.#kafkaProducer.send({
            topic: this.topicName,
            messages: [{
                value: typeof message === 'string' ? message : JSON.stringify(message),
            }],
            compression: CompressionTypes.GZIP
        })
        await this.#kafkaProducer.disconnect();
    }
}

module.exports = new KafkaProducer();