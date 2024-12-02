const twilioClient = require('../config/twilio'); 

async function sendWhatsAppMsg(to, message) {
    try {
        response = await twilioClient.messages.create({
            body: message,
            from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_PHONE_NUMBER, 
            to: 'whatsapp:' + to, 
        });
        console.log('Message sent successfully:', response.sid);
    } catch (error) {
        console.error('Failed to send message:', error);
    }
}

module.exports = sendWhatsAppMsg;
