const User = require("../models/user");
const Listing = require("../models/listing");

// Toggle wishlist - add or remove listing from user's wishlist
module.exports.toggleWishlist = async (req, res) => {
    try {
        const listingId = req.params.id;
        const userId = req.user._id;

        const user = await User.findById(userId);
        const listing = await Listing.findById(listingId);

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        // Check if listing is already in wishlist
        const wishlistIndex = user.wishlist.findIndex(
            id => id.toString() === listingId
        );

        if (wishlistIndex === -1) {
            // Add to wishlist
            user.wishlist.push(listingId);
            await user.save();
            req.flash("success", "Added to wishlist!");
        } else {
            // Remove from wishlist
            user.wishlist.splice(wishlistIndex, 1);
            await user.save();
            req.flash("success", "Removed from wishlist!");
        }

        // Redirect back to the referring page
        const redirectUrl = req.get('Referer') || `/listings/${listingId}`;
        return res.redirect(redirectUrl);
    } catch (error) {
        console.error("Error toggling wishlist:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/listings");
    }
};

// Get user's wishlist
module.exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: "wishlist",
                populate: {
                    path: "owner",
                    options: { strictPopulate: false }
                },
                options: { strictPopulate: false }
            });

        res.render("listings/index.ejs", {
            allListings: user.wishlist,
            totalPages: 1,
            currentPage: 1,
            search: "",
            category: "",
            isWishlist: true
        });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/listings");
    }
};

// Check if listing is in user's wishlist (for UI)
module.exports.isInWishlist = async (userId, listingId) => {
    if (!userId) return false;
    const user = await User.findById(userId);
    return user.wishlist.some(id => id.toString() === listingId.toString());
};
