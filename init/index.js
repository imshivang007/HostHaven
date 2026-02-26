const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
const User = require("../models/user");
const Review = require("../models/review");

// Load environment variables
require("dotenv").config();

const dbUrl = process.env.ATLASDB_URL || "mongodb://localhost:27017/HostHaven";

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then((res) => {
        console.log("MongoDB connected!");
    })
    .catch((err) => {
        console.log("MongoDB not connected!");
    });

const initDB = async () => {
    try {
        // Clear existing data
        await Listing.deleteMany({});
        await Review.deleteMany({});
        await User.deleteMany({});
        
        console.log("Cleared existing data...");

        // Create users and store their IDs
        const createdUsers = [];
        for (const userData of initData.users) {
            // Create user with passport-local-mongoose
            const user = await User.register(
                new User({ 
                    username: userData.username,
                    email: userData.email,
                    bio: userData.bio || "",
                    isVerified: userData.isVerified || true
                }),
                userData.password
            );
            createdUsers.push(user);
        }
        
        console.log(`Created ${createdUsers.length} users...`);

        // Add owner to listings and seed them
        const listingsWithOwners = initData.data.map((listing, index) => ({
            ...listing,
            owner: createdUsers[index % createdUsers.length]._id
        }));
        
        await Listing.insertMany(listingsWithOwners);
        console.log(`Created ${listingsWithOwners.length} listings...`);

        // Get all listings and create reviews
        const allListings = await Listing.find({});
        
        const reviewsToCreate = [];
        let reviewIndex = 0;
        
        // Create reviews for each listing
        for (const listing of allListings) {
            // Create 2-3 reviews per listing
            const numReviews = Math.min(3, initData.reviews.length - reviewIndex);
            
            for (let i = 0; i < numReviews && reviewIndex < initData.reviews.length; i++) {
                const reviewData = initData.reviews[reviewIndex];
                reviewsToCreate.push({
                    comment: reviewData.comment,
                    rating: reviewData.rating,
                    author: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
                    listing: listing._id
                });
                reviewIndex++;
            }
        }
        
        await Review.insertMany(reviewsToCreate);
        console.log(`Created ${reviewsToCreate.length} reviews...`);

        // Update listing review counts and average ratings
        for (const listing of allListings) {
            const reviews = await Review.find({ listing: listing._id });
            const avgRating = reviews.length > 0 
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
                : 0;
            
            await Listing.findByIdAndUpdate(listing._id, {
                reviews: reviews.map(r => r._id),
                avgRating: Math.round(avgRating * 10) / 10,
                bookingCount: 0
            });
        }
        
        console.log("Updated listing ratings and reviews...");
        console.log("Database initialized successfully!");
        
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

// Run initialization
setTimeout(() => {
    initDB().then(() => {
        console.log("Seeding complete!");
        setTimeout(() => {
            mongoose.connection.close();
        }, 1000);
    });
}, 1000);
