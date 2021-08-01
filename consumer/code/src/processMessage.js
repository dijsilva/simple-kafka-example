const producerDLQ = require("./producer_dlq");
const BadInputError = require('./badInputError');

class ProcessMessage {
    async execute({ stringMessage, offset, topic, partition }) {
        try {
          const message = JSON.parse(stringMessage);

          const randomNumber = new Date().getUTCMilliseconds() * Math.ceil(Math.random() * 100);

          const typeOfInput = message.inputMessage;
          
          const randomAppError = typeOfInput.includes("retry");

          const randomBadInputError = typeOfInput.includes("noretry");

          if (randomBadInputError) {
              throw new BadInputError(`Oh! is a non-retriable error ): )`);
          }

          if (randomAppError && randomNumber % 2 === 0) {
            throw new Error('Oh, is a retriable error')
          }

          console.log(`  Message ${offset} processed`);
        } catch (err) {
          if(err.name === 'BadInputError') {
            console.log(` Sending message of offset ${offset} to dead letter queue with topic ${producerDLQ.getTopicName()}`)
            await producerDLQ.sendMessageToDLQ(stringMessage);
          } else {
            console.log(' Random app error');
            throw err;
          }
        }
    }
}

module.exports = new ProcessMessage();
