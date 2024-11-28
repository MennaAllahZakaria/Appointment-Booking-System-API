const express = require("express");

const {
    createAppointment,
    getAllAppointmentsForProvider,
    getAllAppointmentsForUser,
    updateAppointment,
    changeAppointmentStatus,
    deleteAppointment
} = require("../services/appointmentService");

const {
    createAppointmentValidator,
    updateAppointmentValidator,
    deleteAppointmentValidator
} = require("../utils/validators/appointmentValidator");

const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router.use(protect);

router.post("/",createAppointmentValidator,createAppointment);

router.get('/AllForProvider',allowedTo("provider"),getAllAppointmentsForProvider);

router.get('/AllForUser',allowedTo("user"),getAllAppointmentsForUser);

router.route('/:id').put(allowedTo('user'),updateAppointmentValidator,updateAppointment)
                    .delete(allowedTo('user'), deleteAppointmentValidator, deleteAppointment);

router.route('/changeStatus/:id').put(allowedTo('provider'), changeAppointmentStatus);

module.exports = router;