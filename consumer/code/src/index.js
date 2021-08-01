require('dotenv').config()
const express = require('express');
const KafkaConsumer = require('./consumer');

const app = express();

app.get('/health', (_req, res) => {
    return res.json({
        message: `App is alive :::: ${new Date().toISOString()}`
    }).send();
})

const { PORT } = process.env;

app.listen(PORT, async () => {
    console.log(`Application in deploy`)
    await KafkaConsumer.receiveMessage();
    console.log(`Consumer running at port ${PORT}`);
});