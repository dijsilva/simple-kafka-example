"use strict";const { Kafka, logLevel } = require('kafkajs');

class KafkaConsumer {
    #kafkaInstance
    #kafkaConsumer
    constructor() {
        const brokerHost = process.env.KAFKA_BROKER
        this.#kafkaInstance = new Kafka({
            clientId: 'my-app-consumer',
            brokers: [ brokerHost ],
            logLevel: logLevel.ERROR,
        });

        const { KAFKA_GROUP } = process.env;
        this.#kafkaConsumer = this.#kafkaInstance.consumer({
            groupId: KAFKA_GROUP
        });
    }

    async receiveMessage() {
        await this.#connectToKafka();
        await this.#kafkaConsumer.run({
            eachMessage: async ({ message, partition }) => {
                console.log(`Receive message from ${partition}`);
            }
        })
        await this.#disconnect();
    }

    async #connectToKafka() {
        const topicName = process.env.TOPIC_NAME;
        await this.#kafkaConsumer.connect();
        await this.#kafkaConsumer.subscribe({ topic: topicName })
    }

    async #disconnect() {
        await this.#kafkaConsumer.disconnect();
    }
}

module.exports = new KafkaConsumer();