const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

// Pagination settings
const ITEMS_PER_PAGE = 12;

module.exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    const category = req.query.category || "";
    let allListings = [];
    let totalItems = 0;

    try {
        if (category !== "") {
            totalItems = await Listing.countDocuments({ category: category });
            allListings = await Listing.find({ category: category })
                .populate("owner")
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        } else if (search !== "") {
            allListings = await Listing.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "result",
                    },
                },
                {
                    $match: {
                        $or: [
                            { title: { $regex: `\\b${search}`, $options: "i" } },
                            { location: { $regex: `\\b${search}`, $options: "i" } },
                            { country: { $regex: `\\b${search}`, $options: "i" } },
                            { "result.username": { $regex: `\\b${search}`, $options: "i" } },
                            { category: { $regex: `\\b${search}`, $options: "i" } },
                        ],
                    },
                },
            ]);
            totalItems = allListings.length;
            allListings = allListings.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
            for (let listing of allListings) {
                await Listing.populate(listing, { path: "owner" });
            }
        } else {
            totalItems = await Listing.countDocuments({});
            allListings = await Listing.find({})
                .populate("owner")
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        }

        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        res.render("listings/index.ejs", { allListings, totalPages, currentPage: page, search, category });
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
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    if (!req.file) {
        req.flash("error", "Please upload an image!");
        return res.redirect("/listings/new");
    }
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.createdAt = new Date();

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

        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        if (typeof req.file != "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }
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
