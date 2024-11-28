const { check } = require("express-validator");
const validatorMiddleware = require("../../middelware/validatorMiddleware");

const User = require("../../models/userModel");

exports.idValidator=[
    check("id")
                .notEmpty()
                .withMessage("User ID is required")
                .isMongoId()
                .withMessage("User ID is not valid")
    , validatorMiddleware
];

exports.updateUserToProviderValidator=[
    check("specialty")
                    .notEmpty()
                    .withMessage("Specialty is required"),
                    check('availability')
                    .notEmpty()
                    .withMessage("Availability is required"),
    
    validatorMiddleware
];

exports.updateProviderInfoValidator=[
    check("phoneNumber")
                    .optional()
                    .custom((value) =>{
                        const egyptPhoneRegex = /^(\+20|0020|0)?(10|11|12|15)\d{8}$/;
                        if(!egyptPhoneRegex.test(value)){
                            throw new Error("Invalid phone number");
                        }
                        return true;
                    })
                    .withMessage('phoneNumber must valid egyptian phone number'),
    validatorMiddleware

];