const express = require("express");
const router = express.Router();
const razorpay = require("../controllers/razorpay");
const { isLoggedIn } = require("../middleware");

// Initiate Razorpay payment for a booking
router.post("/bookings/:bookingId/pay", isLoggedIn, razorpay.initiatePayment);

// Verify Razorpay payment
router.post("/bookings/:bookingId/verify-payment", isLoggedIn, razorpay.verifyPayment);

// Payment success callback
router.post("/payments/razorpay/success", isLoggedIn, razorpay.paymentSuccess);

// Payment cancel callback
router.post("/payments/razorpay/cancel", razorpay.paymentCancel);

// Get payment status (API endpoint)
router.get("/bookings/:bookingId/payment-status", isLoggedIn, razorpay.getPaymentStatus);

module.exports = router;
