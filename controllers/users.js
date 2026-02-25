const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Review = require("../models/review");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to HostHaven!");
            return res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to HostHaven! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
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
