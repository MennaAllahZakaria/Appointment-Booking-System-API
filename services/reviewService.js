const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");

const User = require("../models/userModel");
const Review = require("../models/reviewModel");


const HandlerFactory = require("./handlerFactory");

// @desc    Create a new review
// @route   POST /reviews/
// @access  Private/user

exports.createReview = asyncHandler(async (req, res, next) => {
    req.body.userId = req.user.id;

    const review = await Review.create(req.body);
    if (!review)
        return next(new ApiError("Failed to create review", 500));

    res.status(201).json({
        success: true,
        data: review,
    });
});

// @desc    get review by id
// @route   GET /reviews/:id
// @access  Private/user

exports.getReview = HandlerFactory.getOne(Review, "user");
// @desc    get all reviews in database
// @route   GET /reviews
// @access  Private/admin

exports.getAllReviews = HandlerFactory.getAll(Review);

// @desc    get all reviews for logged user
// @route   GET /reviews/loggedUserReviews
// @access  Private/user

exports.getAllReviewsForUser = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find({ userId: req.user.id });

    if (!reviews){
        return next(new ApiError("No reviews found for this user", 404));
    }

    res.status(200).json({
        success: true,
        results: reviews.length,
        data: reviews,
    });
});

// @desc    get all reviews for provider
// @route   GET /reviews/providerReviews/:providerId
// @access  Private/user

exports.getAllReviewsForProvider = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find({ providerId: req.params.providerId });

    if (!reviews){
        return next(new ApiError("No reviews found for this provider", 404));
    }

    res.status(200).json({
        success: true,
        results: reviews.length,
        data: reviews,
    });
});

// @desc    update review
// @route   PUT /reviews/:id
// @access  Private/user

exports.updateReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const {title,rating,comment}=req.body;
    const review = await Review.findById(id);
    if ( !review ) {
        return next(new ApiError(`Review with id ${id} not found`, 404));
    }
    if ( !review.userId.equals(req.user.id) ) {
        return next(new ApiError("You are not authorized to update this review", 403));
    }

    const fieldsToUpdate = {};
    if (title !== undefined) fieldsToUpdate.title = title;
    if (rating !== undefined) fieldsToUpdate.rating = rating;
    if (comment !== undefined) fieldsToUpdate.comment = comment;

    Object.assign(review, fieldsToUpdate);

    const updatedReview = await review.save();

    if (!updatedReview){
        return next(new ApiError("Failed to update review", 500));
    }

    res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: updatedReview,
    });
});

// @desc    delete review
// @route   DELETE /reviews/:id
// @access  Private/user

exports.deleteReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if ( !review ) {
        return next(new ApiError(`Review with id ${id} not found`, 404));
    }
    if ( !review.userId.equals(req.user.id) ) {
        return next(new ApiError("You are not authorized to delete this review", 403));
    }

    await review.deleteOne();

    res.status(204).json({
        success: true,
        message: "Review deleted successfully",
    });
});