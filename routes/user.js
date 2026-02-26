const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn, validateProfile } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const userController = require("../controllers/users");

// Authentication routes
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        userController.login
    );

router.get("/logout", userController.logout);

// Email verification routes
router.get("/verify-email-sent", userController.renderVerifyEmailSent);
router.get("/verify-email/:token", wrapAsync(userController.verifyEmail));
router.get("/resend-verification", userController.renderResendVerification);
router.post("/resend-verification", wrapAsync(userController.resendVerification));

// Password reset routes
router
    .route("/forgot-password")
    .get(userController.renderForgotPassword)
    .post(wrapAsync(userController.forgotPassword));

router
    .route("/reset-password/:token")
    .get(userController.renderResetPassword)
    .post(wrapAsync(userController.resetPassword));

// User profile routes
router.get("/profile", isLoggedIn, userController.renderProfile);
router.put("/profile", isLoggedIn, upload.single("profileImage"), validateProfile, wrapAsync(userController.updateProfile));

// User wishlist (full page)
router.get("/my-wishlist", isLoggedIn, userController.getWishlist);

module.exports = router;
