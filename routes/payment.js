const express = require("express");
const router = express.Router();
const payment = require("../controllers/payment");
const { isLoggedIn } = require("../middleware");

// Initiate payment for a booking
router.post("/bookings/:bookingId/pay", isLoggedIn, payment.initiatePayment);

// Payment success callback
router.get("/payments/success", isLoggedIn, payment.paymentSuccess);

// Payment cancel callback
router.get("/payments/cancel", payment.paymentCancel);

// Stripe webhook (needs raw body, so should be before express.json middleware)
// Note: This route should be registered before express.json() in app.js
// For now, we'll handle it as a post route and adjust app.js accordingly

// Get payment status (API endpoint)
router.get("/bookings/:bookingId/payment-status", isLoggedIn, payment.getPaymentStatus);

module.exports = router;
