const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Review = require("../models/review");
const crypto = require("crypto");
const {
    generateVerificationToken,
    generateResetPasswordToken,
    sendVerificationEmail,
    sendPasswordResetEmail
} = require("../utils/email");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        
        // Generate verification token
        const verificationToken = generateVerificationToken();
        
        const newUser = new User({ 
            email, 
            username,
            isVerified: false,
            verificationToken: verificationToken
        });
        
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        
        // Send verification email
        await sendVerificationEmail(registeredUser, verificationToken);
        
        // Don't auto-login after signup - require email verification
        // Store user info in session for post-verification login
        req.session.pendingUserId = registeredUser._id;
        
        req.flash("success", "Registration successful! Please check your email to verify your account.");
        return res.redirect("/verify-email-sent");
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
}

// Render email verification sent page
module.exports.renderVerifyEmailSent = (req, res) => {
    res.render("users/verify-email-sent.ejs");
}

// Verify email
module.exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        
        const user = await User.findOne({ verificationToken: token });
        
        if (!user) {
            req.flash("error", "Invalid or expired verification token. Please request a new verification email.");
            return res.redirect("/resend-verification");
        }
        
        user.isVerified = true;
        user.verifiedAt = new Date();
        user.verificationToken = null;
        await user.save();
        
        req.flash("success", "Email verified successfully! You can now log in to your account.");
        return res.redirect("/login");
    } catch (error) {
        console.error("Error verifying email:", error);
        req.flash("error", "An error occurred while verifying your email. Please try again.");
        return res.redirect("/login");
    }
}

// Render resend verification page
module.exports.renderResendVerification = (req, res) => {
    res.render("users/resend-verification.ejs");
}

// Resend verification email
module.exports.resendVerification = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user) {
            // Don't reveal if email exists
            req.flash("success", "If an account exists with that email, a verification email has been sent.");
            return res.redirect("/resend-verification");
        }
        
        if (user.isVerified) {
            req.flash("success", "This account is already verified. Please log in.");
            return res.redirect("/login");
        }
        
        // Generate new verification token
        const verificationToken = generateVerificationToken();
        user.verificationToken = verificationToken;
        await user.save();
        
        // Send verification email
        await sendVerificationEmail(user, verificationToken);
        
        req.flash("success", "Verification email sent! Please check your inbox.");
        return res.redirect("/verify-email-sent");
    } catch (error) {
        console.error("Error resending verification:", error);
        req.flash("error", "An error occurred. Please try again.");
        return res.redirect("/resend-verification");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        
        // Check if user exists and is verified
        if (user && !user.isVerified) {
            req.flash("error", "Please verify your email before logging in. Check your inbox for the verification link.");
            return res.redirect("/login");
        }
        
        // If we reach here, authentication was successful
        // Note: The actual authentication is handled by passport.authenticate middleware
        // This code runs only after successful authentication
        req.flash("success", "Welcome back to HostHaven! You are logged in!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        return res.redirect(redirectUrl);
    } catch (error) {
        // If there's an error, show error message and redirect to login
        console.error("Login error:", error);
        req.flash("error", "An error occurred during login. Please try again.");
        return res.redirect("/login");
    }
}

// Render forgot password page
module.exports.renderForgotPassword = (req, res) => {
    res.render("users/forgot-password.ejs");
}

// Handle forgot password request
module.exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        
        // Don't reveal if email exists
        if (!user) {
            req.flash("success", "If an account exists with that email, a password reset link has been sent.");
            return res.redirect("/forgot-password");
        }
        
        // Generate reset token
        const resetToken = generateResetPasswordToken();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        
        // Send reset email
        await sendPasswordResetEmail(user, resetToken);
        
        req.flash("success", "If an account exists with that email, a password reset link has been sent.");
        return res.redirect("/forgot-password");
    } catch (error) {
        console.error("Error in forgot password:", error);
        req.flash("error", "An error occurred. Please try again.");
        return res.redirect("/forgot-password");
    }
}

// Render reset password page
module.exports.renderResetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        
        const user = await User.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            req.flash("error", "Password reset token is invalid or has expired. Please request a new password reset.");
            return res.redirect("/forgot-password");
        }
        
        res.render("users/reset-password.ejs", { token });
    } catch (error) {
        console.error("Error rendering reset password:", error);
        req.flash("error", "An error occurred. Please try again.");
        return res.redirect("/forgot-password");
    }
}

// Handle password reset
module.exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;
        
        if (password !== confirmPassword) {
            req.flash("error", "Passwords do not match.");
            return res.redirect(`/reset-password/${token}`);
        }
        
        const user = await User.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            req.flash("error", "Password reset token is invalid or has expired. Please request a new password reset.");
            return res.redirect("/forgot-password");
        }
        
        // Set new password (this handles hashing automatically)
        await user.setPassword(password);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        
        req.flash("success", "Password has been reset successfully. Please log in with your new password.");
        return res.redirect("/login");
    } catch (error) {
        console.error("Error resetting password:", error);
        req.flash("error", "An error occurred. Please try again.");
        return res.redirect(`/reset-password/${token}`);
    }
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        return res.redirect("/listings");
    });
}

// Render user profile
module.exports.renderProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        // Get user's listings
        const listings = await Listing.find({ owner: req.user._id })
            .sort({ createdAt: -1 });
        
        // Get user's bookings (as guest)
        const bookings = await Booking.find({ user: req.user._id })
            .populate("listing")
            .setOptions({ strictPopulate: false })
            .sort({ createdAt: -1 })
            .limit(5);
        
        // Get user's reviews
        const reviews = await Review.find({ author: req.user._id })
            .populate({
                path: "listing",
                select: "title image",
                strictPopulate: false
            })
            .sort({ createdAt: -1 })
            .limit(5);
        
        // Get wishlist count
        const wishlistCount = user.wishlist.length;

        res.render("users/profile.ejs", {
            user,
            listings,
            bookings,
            reviews,
            wishlistCount
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/listings");
    }
};

// Update user profile
module.exports.updateProfile = async (req, res) => {
    try {
        const { username, email, bio } = req.body;
        
        const user = await User.findById(req.user._id);
        
        // Check if email is being changed and if it's already taken
        if (email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                req.flash("error", "Email is already in use!");
                return res.redirect("/profile");
            }
        }
        
        // Check if username is being changed and if it's already taken
        if (username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                req.flash("error", "Username is already taken!");
                return res.redirect("/profile");
            }
        }
        
        user.username = username;
        user.email = email;
        user.bio = bio;
        
        // Update profile image if uploaded
        if (req.file) {
            user.profileImage = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        
        await user.save();
        
        req.flash("success", "Profile updated successfully!");
        return res.redirect("/profile");
    } catch (error) {
        console.error("Error updating profile:", error);
        req.flash("error", "Failed to update profile!");
        return res.redirect("/profile");
    }
};

// Get user's wishlist (full page)
module.exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: "wishlist",
                populate: {
                    path: "owner"
                }
            });

        res.render("listings/index.ejs", {
            allListings: user.wishlist,
            totalPages: 1,
            currentPage: 1,
            search: "",
            category: "",
            isWishlist: true,
            pageTitle: "My Wishlist"
        });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/listings");
    }
};

// Get user's all bookings
module.exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("listing")
            .setOptions({ strictPopulate: false })
            .sort({ createdAt: -1 });

        res.render("bookings/all.ejs", { bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/profile");
    }
};
