const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    image: {
        url: String,
        filename: String
    },
    // Multiple images for gallery
    images: [{
        url: String,
        filename: String
    }],
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    
    // Property details
    guests: {
        type: Number,
        default: 1,
        min: 1
    },
    bedrooms: {
        type: Number,
        default: 1,
        min: 0
    },
    beds: {
        type: Number,
        default: 1,
        min: 0
    },
    baths: {
        type: Number,
        default: 1,
        min: 0
    },
    
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    
    category: {
        type: String,
        enum: ['Trending', 'Rooms', 'Iconic_Cities', 'Mountains', 'Castles', 'Amazing_Pool', 'Camping', 'Farms', 'Arctic', 'Domes', 'House_Boats']
    },
    
    // Amenities array
    amenities: [{
        type: String,
        enum: ['WiFi', 'Kitchen', 'Parking', 'Pool', 'Air Conditioning', 'Heating', 'Washer', 'Dryer', 
               'TV', 'Gym', 'Hot Tub', 'Pets Allowed', 'Smoking Allowed', 'Wheelchair Accessible',
               'Elevator', 'Fireplace', 'Beachfront', 'Lakefront', 'Mountain View', 'City View',
               'Garden', 'BBQ', 'Coffee Maker', 'Microwave', 'Refrigerator', 'Dishwasher', 'Iron',
               'Hair Dryer', 'Workspace', 'EV Charger', 'Security Cameras', 'Doorman']
    }],
    
    // Availability settings
    availability: {
        available: { type: Boolean, default: true },
        minNights: { type: Number, default: 1 },
        maxNights: { type: Number, default: 365 },
        unavailableDates: [{
            start: Date,
            end: Date
        }]
    },
    
    // Cached average rating
    avgRating: {
        type: Number,
        default: 0
    },
    
    // Booking count
    bookingCount: {
        type: Number,
        default: 0
    }
    
});

// Add indexes for faster queries
listingSchema.index({ title: 'text', description: 'text', location: 'text', country: 'text' });
listingSchema.index({ category: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ owner: 1 });
listingSchema.index({ createdAt: -1 });

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}}); 
    }
    

})

const Listing = new mongoose.model("Listing",listingSchema);

module.exports= Listing;