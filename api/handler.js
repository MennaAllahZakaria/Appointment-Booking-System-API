const {sendNotificationsForAppointment}=require('./appointmentNotificationService');
async function handler(req, res) {
 
    if ( req.method==='GET'){
        try{
            await sendNotificationsForAppointment();
    
            res.status(200).json({ message: " jobs executed successfully" });
    
        }catch (error) {
            console.error("Error executing jobs:", error);
            res.status(500).json({ message: "Error executing jobs" });
    
        }
    }

}

module.exports = handler;

