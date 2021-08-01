"use strict";require('dotenv').config()
const express = require('express');
const kafkaProducer = require('./producer');

const app = express();

app.get('/health', (_req, res) => {
    return res.json({
        message: `App is alive :::: ${new Date().toISOString()}`
    }).send();
})

app.get('/send', async (_req, res) => {
    const message = {
        user: 'Diego',
        message: `Hello World from producer app at ${new Date().toISOString()}`
    }
    await kafkaProducer.sendMessage(message);
    return res.json({
        value: message,
    }).send();
})

const { PORT } = process.env;

app.listen(PORT, () => {
    console.log(`Running at port ${PORT}`);
});
