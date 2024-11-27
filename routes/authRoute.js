const express = require("express");
const {
  signup,
  verifyEmailUser,
  protectforget,
  protectCode,
  login,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService");

const {
  signupUserValidator,
  loginValidator,
  resetValidator,
} = require("../utils/validators/authValidator");


const router = express.Router();

router.post(
  "/signup",
  signupUserValidator,
  signup
);
router.post("/verifyEmailUser", protectCode, verifyEmailUser);

router.post("/login", loginValidator, login);

router.post("/forgetPassword", forgetPassword);
router.post("/verifycode", protectforget, verifyPassResetCode);
router.put("/resetPassword", protectforget, resetValidator, resetPassword);

module.exports = router;
