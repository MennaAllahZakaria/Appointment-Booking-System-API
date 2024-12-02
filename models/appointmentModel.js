const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    providerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'canceled'],
        default: 'pending',
    },
    notificationSend:{
        type: Boolean,
        default: false,
    }
    
},{ timestamps: true,});


module.exports = mongoose.model('Appointment', appointmentSchema);


