const ApiError = require("../utils/apiError");

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV == "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name == "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name == "TokenExpiredError") err = handleJwtExpired();
    sendErrorForprod(err, res);
  }
};

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForprod = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again..", 401);
const handleJwtExpired = () =>
  new ApiError("Invalid token, please login again..", 401);

module.exports = globalError;
