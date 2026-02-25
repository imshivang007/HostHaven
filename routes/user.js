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

// User profile routes
router.get("/profile", isLoggedIn, userController.renderProfile);
router.put("/profile", isLoggedIn, upload.single("profileImage"), validateProfile, wrapAsync(userController.updateProfile));

// User wishlist (full page)
router.get("/my-wishlist", isLoggedIn, userController.getWishlist);

// User all bookings
router.get("/my-bookings", isLoggedIn, userController.getAllBookings);

module.exports = router;
