const express = require("express");

const {
    createReview,
    getReview,
    getAllReviews,
    getAllReviewsForUser,
    getAllReviewsForProvider,
    updateReview,
    deleteReview
}=require('../services/reviewService');

const {
    createReviewValidator,
    idValidator,
    updateReviewValidator,

} = require('../utils/validators/reviewValidator');

const { protect, allowedTo } = require('../services/authService');

const router = express.Router();

router.use(protect);

router.get('/loggedUserReviews',getAllReviewsForUser);

router.get('/providerReviews/:providerId',getAllReviewsForProvider);

router.route('/')
                .post( allowedTo('user'),createReviewValidator, createReview)
                .get(allowedTo('admin'),getAllReviews);

router.route('/:id')
                .get(idValidator,getReview)
                .put(allowedTo('user'),updateReviewValidator,updateReview)
                .delete(allowedTo('user','admin'),idValidator, deleteReview);


module.exports = router;