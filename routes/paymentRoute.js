const express = require('express');

const {
    createPaymentIntent,
    confirmPaymentIntent,
    cancelPaymentIntent,
    retrievePaymentIntent,
    updatePaymentIntent,
    markAsPaidInCash
}=require('../services/paymentService');

const {idAppointmentValidator}=require('../utils/validators/appointmentValidator');
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router.use(protect);

router.post('/create/:id', idAppointmentValidator,createPaymentIntent);

router.post('/confirm/:id', idAppointmentValidator,confirmPaymentIntent);

router.post('/cancel/:id', idAppointmentValidator,cancelPaymentIntent);

router.get('/retrieve/:id', idAppointmentValidator,retrievePaymentIntent);

router.put('/update/:id', allowedTo('provider'),idAppointmentValidator, updatePaymentIntent);

router.put('/markAsPaidInCash/:id', allowedTo('provider'),idAppointmentValidator, markAsPaidInCash);

module.exports = router;