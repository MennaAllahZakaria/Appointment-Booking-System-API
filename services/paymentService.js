const stripe = require('../config/stripe');
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");

const Appointment = require('../models/appointmentModel');

// @desc    Create Payment Intent
// @route   POST /payment/create/:id
// @access  Private/user
exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id)
                                            .populate("userId providerId");

    if (!appointment) {
        return next(new ApiError(`Appointment with id ${req.params.id} not found`, 404));
    }

    if (!appointment.userId.equals(req.user.id)) {
        return next(new ApiError("You are not authorized to create a payment intent for this appointment", 403));
    }

    const amount = appointment.amount * 100; // Convert EGP to cents
    const discount = req.body.discount || 0;
    // Ensure the discount is between 0 and 100
    if (discount < 0 || discount > 100) {
        return next(new ApiError("Discount must be between 0 and 100", 400));
    }

    const discountedAmount = amount - (amount * discount / 100); // Apply discount if provided

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: discountedAmount,
            currency: req.body.currency || 'egp',
            payment_method_types: ['card'],
            metadata: {
                appointmentId: appointment.id,
                userId: appointment.userId.toString(),
                providerId: appointment.providerId.toString(),
            },
        });

        // Save payment ID to appointment
        appointment.payment_id = paymentIntent.id;
        await appointment.save();

        // Send verification email
        const message = `Hi ${appointment.userId.name},\n\nWe received a request to pay for your appointment with ID ${appointment.id}. The total amount is EGP ${amount / 100}, and a discount of ${discount}% has been applied, bringing the amount to EGP ${discountedAmount / 100}.\n\nPlease proceed with payment to confirm your appointment.\n\nThank you!\nThe Appointment Booking System Team`;

        await sendEmail({
            email: appointment.userId.email,
            subject: "Payment for Appointment",
            message,
        });

        res.status(201).json({
            success: true,
            data: {
                paymentIntent,
                originalAmount: amount / 100,
                discountApplied: discount,
                discountedAmount: discountedAmount / 100,
            },
        });
    } catch (error) {
        console.error(`Stripe Error: ${error.message}`);
        const errorMessage = error.type === 'StripeCardError' 
            ? "There was an issue with the card information. Please check your details and try again." 
            : "Error creating payment intent. Please try again.";
        return next(new ApiError(errorMessage, error.statusCode || 500));
    }
});
// @desc    Confirm Payment Intent
// @route   POST /payment/confirm/:id
// @access  Private/user
exports.confirmPaymentIntent = asyncHandler(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return next(new ApiError(`Appointment with id ${req.params.id} not found`, 404));
    }

    if (!appointment.userId.equals(req.user.id)) {
        return next(new ApiError("You are not authorized to confirm this payment intent", 403));
    }

    const paymentIntentId = appointment.payment_id;
    if (!paymentIntentId) {
        return next(new ApiError("Payment Intent ID is missing", 400));
    }

    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            return next(new ApiError("Payment confirmation failed", 400));
        }

        // Update appointment payment status
        appointment.isPaid = true;
        appointment.paidAt=new Date.now();
        await appointment.save();

        res.status(200).json({
            success: true,
            data: paymentIntent,
        });
    } catch (error) {
        console.error(`Stripe Error: ${error.message}`);
        return next(new ApiError("Error confirming payment intent. Please try again.", 500));
    }
});

// @desc    Cancel Payment Intent
// @route   POST /payment/cancel/:id
// @access  Private/user
exports.cancelPaymentIntent = asyncHandler(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return next(new ApiError(`Appointment with id ${req.params.id} not found`, 404));
    }

    if (!appointment.userId.equals(req.user.id)) {
        return next(new ApiError("You are not authorized to cancel this payment intent", 403));
    }

    const paymentIntentId = appointment.payment_id;
    if (!paymentIntentId) {
        return next(new ApiError("Payment Intent ID is missing", 400));
    }

    try {
        const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
        if (paymentIntent.status !== 'canceled') {
            return next(new ApiError("Payment cancellation failed", 400));
        }

        // Reset appointment payment status
        appointment.isPaid = false;
        await appointment.save();

        res.status(200).json({
            success: true,
            data: paymentIntent,
        });
    } catch (error) {
        console.error(`Stripe Error: ${error.message}`);
        return next(new ApiError("Error canceling payment intent. Please try again.", 500));
    }
});

// @desc    Retrieve Payment Intent
// @route   GET /payment/retrieve/:id
// @access  Private/user
exports.retrievePaymentIntent = asyncHandler(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return next(new ApiError(`Appointment with id ${req.params.id} not found`, 404));
    }

    if (!appointment.userId.equals(req.user.id)) {
        return next(new ApiError("You are not authorized to retrieve this payment intent", 403));
    }

    const paymentIntentId = appointment.payment_id;
    if (!paymentIntentId) {
        return next(new ApiError("Payment Intent ID is missing", 400));
    }

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        res.status(200).json({
            success: true,
            data: paymentIntent,
        });
    } catch (error) {
        console.error(`Stripe Error: ${error.message}`);
        return next(new ApiError("Error retrieving payment intent. Please try again.", 500));
    }
});

// @desc    Update Payment Intent Metadata
// @route   PUT /payment/update/:id
// @access  Private/user
exports.updatePaymentIntent = asyncHandler(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return next(new ApiError(`Appointment with id ${req.params.id} not found`, 404));
    }

    if (!appointment.userId.equals(req.user.id)) {
        return next(new ApiError("You are not authorized to update this payment intent", 403));
    }

    const paymentIntentId = appointment.payment_id;
    const { metadata } = req.body;

    if (!paymentIntentId || !metadata) {
        return next(new ApiError("Payment Intent ID and metadata are required", 400));
    }

    try {
        const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, { metadata });
        res.status(200).json({
            success: true,
            data: paymentIntent,
        });
    } catch (error) {
        console.error(`Stripe Error: ${error.message}`);
        return next(new ApiError("Error updating payment intent. Please try again.", 500));
    }
});

// @desc    Mark the appointment as payed in cash
// @route   PUT /payment/cash/:id
// @access  Private/provider

exports.markAsPaidInCash = asyncHandler(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
        return next(new ApiError(`Appointment with id ${req.params.id} not found`, 404));
    }
    
    if (!appointment.userId.equals(req.user.id)) {
        return next(new ApiError("You are not authorized to mark this appointment as paid in cash", 403));
    }
    
    appointment.isPaid = true;
    appointment.paidAt = new Date();
    await appointment.save();
    
    res.status(200).json({
        success: true,
        data: appointment,
    });

});