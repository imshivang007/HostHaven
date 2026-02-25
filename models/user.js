const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    // User profile fields
    bio: {
        type: String,
        maxlength: 500,
        default: ""
    },
    profileImage: {
        url: String,
        filename: String
    },
    // Wishlist - array of listing references
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing"
    }],
    // Verification status
    isVerified: {
        type: Boolean,
        default: false
    },
    // Account timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
