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
    },
    amount:{
        type: Number,
        required: true,
    },
    payment_id: String,  // for payment gateway like PayPal, Stripe, etc.
    payment_method: {
        type: String,
        enum: ['cash', 'card'],
        default: 'cash',
    },
    isPaid:{
        type:Boolean,
        defaulte:false
    },
    paidAt:Date,
    
    
},{ timestamps: true,});


module.exports = mongoose.model('Appointment', appointmentSchema);


