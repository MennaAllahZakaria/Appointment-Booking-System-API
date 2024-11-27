const { check } = require("express-validator");
const validatorMiddleware = require("../../middelware/validatorMiddleware");

const User = require("../../models/userModel");

exports.idUserValidator = [
    check("id")
                .notEmpty()
                .withMessage("User ID is required")
                .isMongoId()
                .withMessage("User ID is not valid")
    , validatorMiddleware

];

exports.updateUserValidator = [
    check("name")
                    .optional()
                    .isLength({ min: 3 })
                    .withMessage("name must be at least 3 characters long")
                    .matches(/^[a-zA-Z]+$/)
                    .withMessage("name should only contain English letters"),
    check('phoneNumber')
                    .optional()
                    .custom((value) =>{
                        const egyptPhoneRegex = /^(\+20|0020|0)?(10|11|12|15)\d{8}$/;
                        return egyptPhoneRegex.test(value);
                    })
                    .withMessage('phoneNumber must valid egyptian phone number'),



    validatorMiddleware,
];

