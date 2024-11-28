const { check } = require("express-validator");
const validatorMiddleware = require("../../middelware/validatorMiddleware");

exports.createAppointmentValidator = [

    check("providerId")
                .notEmpty()
                .withMessage("Provider ID is required")
                .isMongoId()
                .withMessage("Provider ID is not valid"),
    check("date")
                .notEmpty()
                .withMessage("Date is required")
                .isISO8601()
                .withMessage("Date is not in ISO 8601 format"),
    check("time")
                .notEmpty()
                .withMessage("Time required")
                .matches(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/)
                .withMessage("Invalid time format. Please use HH:mm format (24-hour format)"),

    validatorMiddleware,

];

exports.updateAppointmentValidator = [
    check("id")
                .notEmpty()
                .withMessage("Appointment ID is required")
                .isMongoId()
                .withMessage("Appointment ID is not valid"),
    check("date")
                .optional()
                .isISO8601()
                .withMessage("Date is not in ISO 8601 format"),
    check("time")
                .optional()
                .matches(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/)
                .withMessage("Invalid time format. Please use HH:mm format (24-hour format)"),

validatorMiddleware,
];

exports.deleteAppointmentValidator = [
    check("id")
                .notEmpty()
                .withMessage("Appointment ID is required")
                .isMongoId()
                .withMessage("Appointment ID is not valid"),
    validatorMiddleware,];