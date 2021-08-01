"use strict";const { Kafka, CompressionTypes } = require('kafkajs');

class KafkaProducer {
    #kafkaInstance
    #kafkaProducer
    constructor() {
        const brokerHost = process.env.KAFKA_BROKER
        const logLevel = process.env.LOG_LEVEL
        this.#kafkaInstance = new Kafka({
            clientId: 'my-app-producer',
            brokers: [ brokerHost ],
            logLevel: logLevel.ERROR,
        });

        this.#kafkaProducer = this.#kafkaInstance.producer();
    }

    async sendMessage(message) {
        const topicName = process.env.TOPIC_NAME;
        await this.#kafkaProducer.connect();
        await this.#kafkaProducer.send({
            topic: topicName,
            messages: [{
                value: typeof message === 'string' ? message : JSON.stringify(message),
            }],
            compression: CompressionTypes.GZIP
        })
        await this.#kafkaProducer.disconnect();
    }
}

module.exports = new KafkaProducer();