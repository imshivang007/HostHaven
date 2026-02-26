const Booking = require("../models/booking");
const razorpayController = require("./razorpay");

// Re-export Razorpay payment functions for backward compatibility
module.exports.initiatePayment = razorpayController.initiatePayment;
module.exports.paymentSuccess = razorpayController.paymentSuccess;
module.exports.paymentCancel = razorpayController.paymentCancel;
module.exports.handleWebhook = razorpayController.handleWebhook;
module.exports.verifyPayment = razorpayController.verifyPayment;
module.exports.getPaymentStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        
        // Check if user owns this booking or is the host
        const Listing = require("../models/listing");
        const listing = await Listing.findById(booking.listing);
        
        const isGuest = booking.user.equals(req.user._id);
        const isHost = listing && listing.owner.equals(req.user._id);
        
        if (!isGuest && !isHost) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        
        res.json({
            paymentStatus: booking.paymentStatus,
            totalPrice: booking.totalPrice,
            status: booking.status
        });
        
    } catch (error) {
        console.error("Error fetching payment status:", error);
        res.status(500).json({ error: "Failed to fetch payment status" });
    }
};
