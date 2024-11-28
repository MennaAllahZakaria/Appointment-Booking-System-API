const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");

const User = require("../models/userModel");

const { sanitizeProvidor, sanitizeProviders } = require("../utils/sanitizeData");

const HandlerFactory = require("./handlerFactory");

// @desc    create provider
// @route   POST /providers
// @access  Private/user

exports.createProvider = asyncHandler(async (req, res, next) => {
    req.body.role = "provider";
    next();

});

// @desc    update logged user to provider
// @route   PUT /providers
// @access  Private/user

exports.updateUserToProvider = asyncHandler(async (req, res, next) => {
    const {specialty,availability}=req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
        specialty: specialty,
        availability:availability,
        role: "provider",
        },
        {
        new: true,
        }
    );

    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    res.status(200).json({ status: "success", data: sanitizeProvidor(user) });
});


// @desc    Get all providers
// @route   GET /providers
// @access  Private/user

exports.getAllProviders = asyncHandler(async (req, res, next) => {
    const providers = await User.find({ role: "provider" });
    if (!providers.length) {
        return next(new ApiError("No providers found", 404));
    }
    res.status(200).json({ results: providers.length, data: sanitizeProviders(providers) });
});

// @desc    Get provider by id
// @route   GET /providers/:id
// @access  Private/user
exports.getProvider = HandlerFactory.getOne(User, "Provider");

// @desc    Get provider availability
// @route   GET /providers/availability/:id
// @access  Private/user

exports.getProviderAvailability =asyncHandler(async (req,res,next)=>{
    const provider = await User.findById(req.params.id);
    if (!provider) {
        return next(new ApiError("Provider not found", 404));
    }
    res.status(200).json({ availability: provider.availability });

});
// @desc    Get providers by specialization
// @route   GET /providers/specialization/:specialization
// @access  Private/user

exports.getProvidersBySpecialization = asyncHandler(async (req, res, next) => {
    const providers = await User.find({ role: "provider", specialty: req.params.specialization });
    if (!providers.length) {
        return next(new ApiError("No providers found with this specialization", 404));
    }
    res.status(200).json({ results: providers.length, data: sanitizeProviders(providers) });
});

// @desc    update logged user (provider) info
// @route   PUT /providers/info
// @access  Private/user

exports.updateProviderInfo = asyncHandler(async (req, res, next) => {
    const { specialty, availability,phoneNumber } = req.body;

    const user= await User.findById(req.user.id);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }
    if ( user.role!=='provider'){
        return next(new ApiError("User is not a provider", 403));
    }
    if (specialty)user.specialty = specialty;
    if (availability)user.availability.push(...availability);
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({ status: "success", data: sanitizeProvidor(user) });
});

// @desc    Delete provider by id
// @route   DELETE /providers/:id
// @access  Private/admin
exports.deleteProvider = asyncHandler(async (req, res, next) => {
    const provider = await User.findByIdAndDelete(req.params.id);
    if (!provider) {
        return next(new ApiError("Provider not found", 404));
    }

    res.status(200).json({ msg: "Provider deleted" });
});

