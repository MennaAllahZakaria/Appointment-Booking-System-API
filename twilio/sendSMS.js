const twilioClient = require('../config/twilio'); 

async function sendSMS(to, message) {
    try {
        const response = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER, 
            to: to,
        });
        console.log('Message sent successfully:', response.sid);
    } catch (error) {
        console.error('Failed to send message:', error);
    }
}

module.exports = sendSMS;
