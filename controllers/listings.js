const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");

// Pagination settings
const ITEMS_PER_PAGE = 12;

module.exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const priceRange = req.query.priceRange || "";
    const amenities = req.query.amenities || "";
    const sortBy = req.query.sortBy || "";
    
    let query = {};
    let allListings = [];
    let totalItems = 0;

    try {
        // Build query based on filters
        if (category !== "") {
            query.category = category;
        }
        
        // Price range filter
        if (priceRange !== "") {
            const [minPrice, maxPrice] = priceRange.split('-');
            if (maxPrice) {
                query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
            } else if (priceRange === '25000+') {
                query.price = { $gte: 25000 };
            }
        }
        
        // Amenities filter
        if (amenities !== "") {
            query.amenities = { $in: [amenities] };
        }

        // Build base query
        let baseQuery = Listing.find(query);
        
        // Apply sorting
        if (sortBy === 'price-low') {
            baseQuery = baseQuery.sort({ price: 1 });
        } else if (sortBy === 'price-high') {
            baseQuery = baseQuery.sort({ price: -1 });
        } else if (sortBy === 'rating') {
            baseQuery = baseQuery.sort({ avgRating: -1 });
        }
        
        // Execute query with pagination
        totalItems = await Listing.countDocuments(query);
        allListings = await baseQuery
            .populate("owner")
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
        
        // Search (if provided)
        if (search !== "") {
            const searchRegex = new RegExp(search, 'i');
            allListings = allListings.filter(listing => 
                searchRegex.test(listing.title) ||
                searchRegex.test(listing.location) ||
                searchRegex.test(listing.country) ||
                (listing.owner && searchRegex.test(listing.owner.username)) ||
                searchRegex.test(listing.category)
            );
            totalItems = allListings.length;
        }

        // Check wishlist status for each listing if user is logged in
        let wishlistIds = [];
        if (req.user) {
            const user = await User.findById(req.user._id);
            if (user && user.wishlist) {
                wishlistIds = user.wishlist.map(id => id.toString());
            }
        }
        
        // Add isInWishlist flag to each listing
        allListings = allListings.map(listing => {
            const listingObj = listing.toObject();
            listingObj.isInWishlist = wishlistIds.includes(listing._id.toString());
            return listingObj;
        });

        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        res.render("listings/index.ejs", { 
            allListings, 
            totalPages, 
            currentPage: page, 
            search, 
            category
        });
    } catch (error) {
        if (error.status === 404) {
            req.flash("error", error.message);
            return res.redirect("/listings");
        }
        req.flash("error", error.message);
        return res.redirect("/listings");
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    
    // Check if user has this listing in wishlist
    let isInWishlist = false;
    if (req.user) {
        const user = await User.findById(req.user._id);
        if (user && user.wishlist) {
            isInWishlist = user.wishlist.some(wishlistId => wishlistId.toString() === listing._id.toString());
        }
    }
    
    res.render("listings/show.ejs", { listing, isInWishlist });
}

module.exports.createListing = async (req, res, next) => {
    // Handle files from upload.fields()
    const files = req.files || {};
    const mainImageFile = files['listing[image]'] ? files['listing[image]'][0] : null;
    
    if (!mainImageFile) {
        req.flash("error", "Please upload an image!");
        return res.redirect("/listings/new");
    }
    
    let url = mainImageFile.path;
    let filename = mainImageFile.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.createdAt = new Date();

    // Handle additional images (gallery)
    if (files['listing[images]']) {
        const additionalImages = files['listing[images]'].map(file => ({
            url: file.path,
            filename: file.filename
        }));
        newListing.images = additionalImages;
    }

    // Convert availability checkbox value to boolean
    if (newListing.availability) {
        if (newListing.availability.available === 'on' || newListing.availability.available === true || newListing.availability.available === 'true') {
            newListing.availability.available = true;
        } else {
            newListing.availability.available = false;
        }
    }

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image ? listing.image.url : "";
    if (originalImageUrl) {
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    }
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res, next) => {
    try {
        if (!req.body.listing) {
            throw new ExpressError(400, "Send valid data for listing");
        }

        // Handle files from upload.fields()
        const files = req.files || {};
        
        let { id } = req.params;
        
        // Find existing listing first
        let listing = await Listing.findById(id);
        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }
        
        // Update with new data
        Object.assign(listing, req.body.listing);
        
        // Handle main image update
        const mainImageFile = files['listing[image]'] ? files['listing[image]'][0] : null;
        if (mainImageFile) {
            listing.image.url = mainImageFile.path;
            listing.image.filename = mainImageFile.filename;
        }
        
        // Handle additional images update
        if (files['listing[images]']) {
            const additionalImages = files['listing[images]'].map(file => ({
                url: file.path,
                filename: file.filename
            }));
            listing.images.push(...additionalImages);
        }
        
        // Convert availability checkbox value to boolean
        // When checkbox is unchecked, it won't be present in the body
        // Initialize availability object if it doesn't exist
        if (!listing.availability) {
            listing.availability = {
                available: true,
                minNights: 1,
                maxNights: 365,
                unavailableDates: []
            };
        }
        
        if (req.body.listing && req.body.listing.availability) {
            const availValue = req.body.listing.availability.available;
            // Checkbox sends "on" when checked, and is undefined when unchecked
            if (availValue === 'on' || availValue === true || availValue === 'true' || availValue === 'checked') {
                listing.availability.available = true;
            } else {
                listing.availability.available = false;
            }
            
            // Ensure minNights and maxNights are numbers
            if (req.body.listing.availability.minNights !== undefined && req.body.listing.availability.minNights !== '') {
                listing.availability.minNights = parseInt(req.body.listing.availability.minNights) || 1;
            }
            if (req.body.listing.availability.maxNights !== undefined && req.body.listing.availability.maxNights !== '') {
                listing.availability.maxNights = parseInt(req.body.listing.availability.maxNights) || 365;
            }
        } else {
            // Checkbox was unchecked - set available to false
            listing.availability.available = false;
        }
        
        await listing.save();
        
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
}

module.exports.deleteListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
}
