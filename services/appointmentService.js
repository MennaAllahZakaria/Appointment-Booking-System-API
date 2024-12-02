const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");

const User = require("../models/userModel");

const Appointment = require("../models/appointmentModel");
// @desc    create a new Appointment
// @route   POST /appointments/
// @access  Private/user

exports.createAppointment =asyncHandler(async (req,res,next)=>{
    const {  providerId, date, time } = req.body;

    req.body.userId=req.user.id;

    const provider = await User.findById(providerId);
    if(!provider){
        return next(new ApiError(`No provider found with id ${providerId}`, 404));
    }
    if (provider.role!=="provider"){
        return next(new ApiError("Only providers can recive appointments", 403));
    }

    const appointment = await Appointment.create(req.body);

    const user = req.user;
    user.appointments.push(appointment._id);
    await user.save();

    provider.appointments.push(appointment._id);
    await provider.save();

    res.status(201).json({data: appointment});
});
// @desc    get All Appointments For Provider
// @route   GET /appointments/AllForProvider
// @access  Private/provider

exports.getAllAppointmentsForProvider = asyncHandler(async (req,res,next)=>{
    
    const appointments = await Appointment.find({ providerId: req.user.id });
    res.status(200).json({data: appointments});
});

// @desc    get All Appointments For user
// @route   GET /appointments/AllForUser
// @access  Private/user

exports.getAllAppointmentsForUser = asyncHandler(async (req,res,next)=>{

    const appointments = await Appointment.find({ userId: req.user.id });
    res.status(200).json({data: appointments});
});

// @desc    update the appointment 
// @route   PUT /appointments/:id
// @access  Private/user

exports.updateAppointment = asyncHandler(async (req,res,next)=>{
    const {date,time}   =req.body;
    const appointment = await Appointment.findById(req.params.id);
    if(!appointment){
        return next(new ApiError(`No appointment found with id ${req.params.id}`, 404));
    }
    if(appointment.userId!=req.user.id){
        return next(new ApiError("Only user can update their own appointment", 403));
    }

    if (date)appointment.date = date;
    if (time) appointment.time = time;

    appointment.save();

    res.status(200).json({data: appointment});
});

// @desc    change the appointment status
// @route   PUT /appointments/changeStatus/:id
// @access  Private/provider

exports.changeAppointmentStatus = asyncHandler(async (req,res,next)=>{
    
    const appointment = await Appointment.findById(req.params.id);
    if(!appointment){
        return next(new ApiError(`No appointment found with id ${req.params.id}`, 404));
    }
    if(appointment.providerId!=req.user.id){
        return next(new ApiError("Only provider can update their own appointment status", 403));
    }
    if(req.body.status!=="pending" && req.body.status!=="accepted" && req.body.status!=="rejected" && req.body.status!=="completed"){
        return next(new ApiError("Invalid status", 400));
    }
    appointment.status = req.body.status;
    appointment.save();
    res.status(200).json({data: appointment});
});

// @desc    delete the appointment
// @route   DELETE /appointments/:id
// @access  Private/user

exports.deleteAppointment = asyncHandler(async (req,res,next)=>{
    const appointment = await Appointment.findById(req.params.id);
    if(!appointment){
        return next(new ApiError(`No appointment found with id ${req.params.id}`, 404));
    }
    if(!appointment.userId.equals(req.user.id)){
        return next(new ApiError("Only user can delete their own appointment", 403));
    }
    const user=req.user;
    user.appointments.pull(appointment._id);
    await user.save();

    const provider = await User.findById(appointment.providerId);
    if(!provider) 
        return next(new ApiError(`No provider found with id ${appointment.providerId}`, 404));
    provider.appointments.pull(appointment._id);
    await provider.save();

    await appointment.deleteOne();
    
    res.status(204).json({msg: "Appointment deleted"});
});
