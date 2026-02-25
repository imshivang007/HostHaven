const Joi = require("joi");

// Email regex pattern for validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        category: Joi.string().valid('Trending', 'Rooms', 'Iconic_Cities', 'Mountains', 'Castles', 'Amazing_Pool', 'Camping', 'Farms', 'Arctic', 'Domes', 'House_Boats'),
        amenities: Joi.array().items(Joi.string()),
        availability: Joi.object({
            available: Joi.alternatives().try(Joi.boolean(), Joi.valid('on', 'true', 'false', '')),
            minNights: Joi.number().min(1).max(365),
            maxNights: Joi.number().min(1).max(365)
        })
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
})

module.exports.userSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().pattern(emailRegex).required(),
        password: Joi.string().min(6).required()
    }).required()
})

// Profile update schema (without password)
module.exports.profileSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().pattern(emailRegex).required(),
    bio: Joi.string().max(500).allow('')
})
