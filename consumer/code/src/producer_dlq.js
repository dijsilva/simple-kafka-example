const { Kafka, logLevel } = require("kafkajs");

class DLQKafka {
    #kafkaInstance;
    #kafkaProducer;
    #topicName
    constructor() {
      this.#topicName = process.env.TOPIC_DLQ_NAME;
        const brokerHost = process.env.KAFKA_BROKER;
        this.#kafkaInstance = new Kafka({
            clientId: "my-app-consumer",
            brokers: [brokerHost],
            logLevel: logLevel.NOTHING,
            retry: {
                retries: 2,
            },
        });
        this.#kafkaProducer = this.#kafkaInstance.producer();
    }

    async sendMessageToDLQ(message) {
      await this.#kafkaProducer.connect();
      await this.#kafkaProducer.send({
        topic: this.#topicName,
        messages: [{
          value: typeof message === 'string' ? message : JSON.stringify(message),
        }],
      });
      await this.#kafkaProducer.disconnect();
    }

    getTopicName() {
      return this.#topicName;
    }
}

module.exports = new DLQKafka();
