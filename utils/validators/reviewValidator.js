const { check } = require("express-validator");
const validatorMiddleware = require("../../middelware/validatorMiddleware");

const User = require("../../models/userModel");

exports.createReviewValidator=[
    check('userId')
                .notEmpty()
                .withMessage('User ID is required')
                .isMongoId()
                .withMessage('User ID is not valid'),
    check('providerId')
                .notEmpty()
                .withMessage('Provider ID is required')
                .isMongoId()
                .withMessage('Provider ID is not valid')
                .custom(async (provider) => {
                    const user = await User.findById(provider);
                    if (!user) {
                        throw new Error('Provider ID does not exist');
                    }
                    if (user.role !== 'provider') {
                        throw new Error('The specified user is not a provider');
                    }
                    return true;
                }),
    check('title')
                .notEmpty()
                .withMessage('Title is required')
                .isLength({ min: 5, max: 50 })
                .withMessage('Title must be between 5 and 50 characters long'),
    check('rating')
                .notEmpty()
                .withMessage('Rating is required')
                .isNumeric()
                .withMessage('Rating must be a number')
                .custom((value) => {
                    if (value < 1 || value > 5) {
                        throw new Error('Rating must be between 1 and 5');
                    }
                    return true;
                }),
    check('comment')
                .notEmpty()
                .withMessage('Comment is required')
                .isLength({ min: 5, max: 500 })
                .withMessage('Comment must be between 5 and 500 characters long'),
    validatorMiddleware,

];

exports.idValidator = [
    check('id')
                .notEmpty()
                .withMessage('Review ID is required')
                .isMongoId()
                .withMessage('Review ID is not valid'),
    validatorMiddleware,

];

exports.updateReviewValidator = [
    check('id')
                .notEmpty()
                .withMessage('Review ID is required')
                .isMongoId()
                .withMessage('Review ID is not valid'),
    check('title')
                .optional()
                .isLength({ min: 5, max: 50 })
                .withMessage('Title must be between 5 and 50 characters long'),
    check('rating')
                .optional()
                .isNumeric()
                .withMessage('Rating must be a number')
                .custom((value) => {
                    if (value < 1 || value > 5) {
                        throw new Error('Rating must be between 1 and 5');
                    }
                    return true;
                }),
    check('comment')
                .optional()
                .isLength({ min: 5, max: 500 })
                .withMessage('Comment must be between 5 and 500 characters long'),
    validatorMiddleware,
];