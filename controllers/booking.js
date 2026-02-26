const Booking = require("../models/booking");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

// Create a new booking
module.exports.createBooking = async (req, res, next) => {
    try {
        const listingId = req.params.id;
        const { checkIn, checkOut, guests, guestName, guestEmail, guestPhone, specialRequests } = req.body;

        // Validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        if (checkInDate >= checkOutDate) {
            req.flash("error", "Check-out date must be after check-in date!");
            return res.redirect(`/listings/${listingId}`);
        }

        if (checkInDate < new Date()) {
            req.flash("error", "Check-in date cannot be in the past!");
            return res.redirect(`/listings/${listingId}`);
        }

        const listing = await Listing.findById(listingId);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        // Check if listing is available for booking
        if (listing.availability && listing.availability.available === false) {
            req.flash("error", "This listing is not available for booking at this time!");
            return res.redirect(`/listings/${listingId}`);
        }

        // Check for overlapping bookings
        const overlappingBookings = await Booking.find({
            listing: listingId,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
                // New checkIn overlaps with existing booking
                {
                    checkIn: { $lte: checkInDate },
                    checkOut: { $gt: checkInDate }
                },
                // New checkOut overlaps with existing booking
                {
                    checkIn: { $lt: checkOutDate },
                    checkOut: { $gte: checkOutDate }
                },
                // New booking completely contains existing booking
                {
                    checkIn: { $gte: checkInDate },
                    checkOut: { $lte: checkOutDate }
                },
                // New booking is completely contained within existing booking
                {
                    checkIn: { $lte: checkInDate },
                    checkOut: { $gte: checkOutDate }
                }
            ]
        });

        if (overlappingBookings.length > 0) {
            req.flash("error", "These dates are not available! Please select different dates.");
            return res.redirect(`/listings/${listingId}`);
        }

        // Calculate total price
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const totalPrice = listing.price * nights;

        const booking = new Booking({
            user: req.user._id,
            listing: listingId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: parseInt(guests),
            totalPrice,
            guestName,
            guestEmail,
            guestPhone,
            specialRequests,
            status: 'confirmed',
            paymentStatus: 'pending'
        });

        await booking.save();
        
        // Update listing booking count
        listing.bookingCount += 1;
        await listing.save();

// Redirect to booking details page where user can pay
        req.flash("success", "Booking created! Please complete your payment.");
        res.redirect(`/bookings/${booking._id}`);
    } catch (error) {
        console.error("Error creating booking:", error);
        req.flash("error", "Failed to create booking!");
        return res.redirect(`/listings/${req.params.id}`);
    }
};

// Show booking details
module.exports.showBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate("listing")
            .setOptions({ strictPopulate: false })
            .populate("user")
            .setOptions({ strictPopulate: false });

        if (!booking) {
            req.flash("error", "Booking not found!");
            return res.redirect("/listings");
        }

        // Check if user is the booking owner or listing owner
        const isOwner = booking.listing && booking.listing.owner ? booking.listing.owner.equals(req.user._id) : false;
        const isGuest = booking.user && booking.user._id ? booking.user._id.equals(req.user._id) : false;

        if (!isOwner && !isGuest) {
            req.flash("error", "You don't have permission to view this booking!");
            return res.redirect("/listings");
        }

        res.render("bookings/show.ejs", { booking, isOwner, isGuest });
    } catch (error) {
        console.error("Error showing booking:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/listings");
    }
};

// User's bookings (as guest)
module.exports.myBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("listing")
            .setOptions({ strictPopulate: false })
            .sort({ createdAt: -1 });

        res.render("bookings/index.ejs", { bookings, type: "guest" });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/listings");
    }
};

// Host's bookings (listings user owns)
module.exports.hostBookings = async (req, res) => {
    try {
        const listings = await Listing.find({ owner: req.user._id });
        const listingIds = listings.map(l => l._id);

        const bookings = await Booking.find({ listing: { $in: listingIds } })
            .populate("listing")
            .setOptions({ strictPopulate: false })
            .populate("user")
            .setOptions({ strictPopulate: false })
            .sort({ createdAt: -1 });

        res.render("bookings/index.ejs", { bookings, type: "host" });
    } catch (error) {
        console.error("Error fetching host bookings:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/listings");
    }
};

// Cancel booking
module.exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate("listing")
            .setOptions({ strictPopulate: false });

        if (!booking) {
            req.flash("error", "Booking not found!");
            return res.redirect("/bookings");
        }

        // Check if user is the booking owner or listing owner
        const isOwner = booking.listing && booking.listing.owner ? booking.listing.owner.equals(req.user._id) : false;
        const isGuest = booking.user && booking.user._id ? booking.user._id.equals(req.user._id) : false;

        if (!isOwner && !isGuest) {
            req.flash("error", "You don't have permission to cancel this booking!");
            return res.redirect("/bookings");
        }

        booking.status = 'cancelled';
        await booking.save();

        req.flash("success", "Booking cancelled successfully!");
        res.redirect("/bookings");
    } catch (error) {
        console.error("Error cancelling booking:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/bookings");
    }
};

// Get all unavailable dates for a listing
module.exports.getUnavailableDates = async (req, res) => {
    try {
        const bookings = await Booking.find({
            listing: req.params.id,
            status: { $in: ['pending', 'confirmed'] },
            checkOut: { $gt: new Date() }
        });

        const unavailableDates = [];
        bookings.forEach(booking => {
            let currentDate = new Date(booking.checkIn);
            const endDate = new Date(booking.checkOut);
            
            while (currentDate < endDate) {
                unavailableDates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        res.json({ unavailableDates });
    } catch (error) {
        console.error("Error fetching unavailable dates:", error);
        res.status(500).json({ error: "Failed to fetch unavailable dates" });
    }
};
