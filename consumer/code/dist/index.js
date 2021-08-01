"use strict";require('dotenv').config()
const express = require('express');
const KafkaCpnsumer = require('./consumer');

const app = express();

app.get('/health', (_req, res) => {
    return res.json({
        message: `App is alive :::: ${new Date().toISOString()}`
    }).send();
})

const { PORT } = process.env;

app.listen(PORT, async () => {
    await KafkaCpnsumer.receiveMessage();
    console.log(`Running at port ${PORT}`);
});
