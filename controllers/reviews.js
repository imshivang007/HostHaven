const Review = require("../models/review");
const Listing = require("../models/listing");

// Helper function to calculate and update average rating
async function updateListingRating(listingId) {
    const listing = await Listing.findById(listingId);
    if (!listing) return;

    const reviews = await Review.find({ _id: { $in: listing.reviews } });
    
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / reviews.length;
        listing.avgRating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
    } else {
        listing.avgRating = 0;
    }
    
    await listing.save();
}

module.exports.createReview = async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
        
        // Update average rating
        await updateListingRating(listing._id);

        req.flash("success", "New Review Created!");
        return res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error("Error creating review:", error);
        req.flash("error", "Failed to create review!");
        return res.redirect(`/listings/${req.params.id}`);
    }
}

module.exports.deleteReview = async (req, res) => {
    try {
        let { id, reviewId } = req.params;
        
        // Verify the listing exists
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        // Verify the review exists
        const review = await Review.findById(reviewId);
        if (!review) {
            req.flash("error", "Review not found!");
            return res.redirect(`/listings/${id}`);
        }

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        
        // Update average rating
        await updateListingRating(id);

        req.flash("success", "Review Deleted!");
        return res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error deleting review:", error);
        req.flash("error", "Failed to delete review!");
        return res.redirect(`/listings/${req.params.id}`);
    }
};
