require('dotenv').config();
const mongoose = require("mongoose");
const Review = require("../models/review");
const Listing = require("../models/listing");

async function updateReviewsWithListing() {
    try {
        // Use the same database URL as the app
        const dbUrl = process.env.ATLASDB_URL || "mongodb://localhost:27017/hosthaven";
        await mongoose.connect(dbUrl);
        console.log("Connected to MongoDB");

        // Find all reviews that don't have a listing field
        const reviewsWithoutListing = await Review.find({ listing: { $exists: false } });
        console.log(`Found ${reviewsWithoutListing.length} reviews without listing field`);

        // For each review, find the listing that contains this review
        const listings = await Listing.find({});
        
        let updatedCount = 0;
        for (const review of reviewsWithoutListing) {
            for (const listing of listings) {
                if (listing.reviews.includes(review._id)) {
                    review.listing = listing._id;
                    await review.save();
                    console.log(`Updated review ${review._id} with listing ${listing._id}`);
                    updatedCount++;
                    break;
                }
            }
        }

        console.log(`Migration complete! Updated ${updatedCount} reviews.`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error during migration:", error);
        process.exit(1);
    }
}

updateReviewsWithListing();
