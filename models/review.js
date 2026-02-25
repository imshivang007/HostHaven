const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment :String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    created:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    listing:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Listing"
    }
});

const Review=mongoose.model("Review",reviewSchema);
module.exports=Review;