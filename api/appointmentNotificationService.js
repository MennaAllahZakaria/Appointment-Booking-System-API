const twilio = require('../config/twilio');
const sendSMS = require('../twilio/sendSMS');
const whatsapp = require('../twilio/sendWhatsapp');

const Appointment =require('../models/appointmentModel');

async function sendNotificationsForAppointment(){
    console.log("Running sending notifications for appointment");

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)); 
    const endOfDay = new Date(now.setHours(23, 59, 59, 999)); 
    
    const appointments = await Appointment.find({
        date: { $gte: startOfDay, $lte: endOfDay },
        status: 'pending',
        notificationSend: { $ne: true }, 
    }).populate('userId providerId');

    if(!appointments.length){
        console.log("No pending appointments found");
        return;
    }

    for(const appointment of appointments){
        const appointmentTime = new Date(appointment.date);
        const appointmentTimeString = appointmentTime.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
        const message = `Reminder: You have an appointment with ${appointment.providerId.name} at ${appointmentTimeString}. Please confirm or cancel.`;
        try{
            const sms=await sendSMS(appointment.userId.phoneNumber, message);
            console.log(`SMS sent to ${appointment.userId.phoneNumber}: ${message}`,sms);

            //const whatsappMsg= await whatsapp(appointment.userId.phoneNumber, message);
            //console.log(`whatsApp msg sent to ${appointment.userId.phoneNumber}: ${message}`,whatsappMsg);
            
            appointment.notificationSend =true;
            await appointment.save();

        }catch(error){
            console.error(`Failed to send SMS to ${appointment.userId.phoneNumber}: ${error.message}`);
            continue;
        }
        
    }

}


module.exports = sendNotificationsForAppointment;

