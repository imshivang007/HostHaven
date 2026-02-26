const express = require("express");
const router = express.Router();
const booking = require("../controllers/booking");
const { isLoggedIn } = require("../middleware");

// Get unavailable dates for a listing
router.get("/listings/:id/availability", booking.getUnavailableDates);

// Create a new booking
router.post("/listings/:id/book", isLoggedIn, booking.createBooking);

// Show booking details
router.get("/bookings/:bookingId", isLoggedIn, booking.showBooking);

// User's bookings (as guest)
router.get("/my-bookings", isLoggedIn, booking.myBookings);

// Host's bookings (listings user owns)
router.get("/host-bookings", isLoggedIn, booking.hostBookings);

// Cancel booking
router.post("/bookings/:bookingId/cancel", isLoggedIn, booking.cancelBooking);

// Initiate payment for a booking
router.post("/bookings/:bookingId/pay", isLoggedIn, require("../controllers/payment").initiatePayment);

module.exports = router;
