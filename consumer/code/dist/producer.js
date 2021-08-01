"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _kafkajs = require('kafkajs');

class KafkaProducer {
    constructor() {
        const broker = process.env.KAFKA_BROKER
        const logLevel = process.env.LOG_LEVEL
        this.#kafkaInstance = new (0, _kafkajs.Kafka)({
            clientId: 'my-app-producer',
            brokers: [ broker ],
            logLevel,
        });

        this.#kafkaProducer = this.#kafkaInstance.producer();
    }

    async sendMessage(message) {
        const topic = process.env.TOPIC_NAME;
        await this.#kafkaProducer.connect();
        await this.#kafkaProducer.send({
            topic,
            messages: [message],
        })
        await this.#kafkaProducer.disconnect();
    }
}

exports. default = new KafkaProducer();