require('dotenv').config()
const express = require('express');
const kafkaProducer = require('./producer');

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/health', (_req, res) => {
    return res.json({
        message: `App is alive :::: ${new Date().toISOString()}`
    }).send();
})

app.post('/send', async (req, res) => {
    const { inputMessage } = req.body
    const message = {
        inputMessage,        
        timestamp: new Date().toISOString(),
    }
    await kafkaProducer.sendMessage(message);
    return res.json({
        value: message,
    }).send();
})

const { PORT } = process.env;

app.listen(PORT, () => {
    console.log(`Producer running at port ${PORT}`);
});
