const Booking = require("../models/booking");
const Listing = require("../models/listing");
const razorpayConfig = require("../config/razorpay");
const ExpressError = require("../utils/ExpressError");

// Initiate Razorpay payment for a booking
module.exports.initiatePayment = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        
        // Check if Razorpay is configured
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("Razorpay keys are not configured!");
            req.flash("error", "Payment system is not configured. Please contact the administrator.");
            return res.redirect(`/bookings/${bookingId}`);
        }
        
        const booking = await Booking.findById(bookingId)
            .populate("listing")
            .setOptions({ strictPopulate: false });
        
        if (!booking) {
            req.flash("error", "Booking not found!");
            return res.redirect("/my-bookings");
        }
        
        // Check if user owns this booking
        if (!booking.user.equals(req.user._id)) {
            req.flash("error", "You don't have permission to make payment for this booking!");
            return res.redirect("/my-bookings");
        }
        
        // Check if already paid
        if (booking.paymentStatus === 'paid') {
            req.flash("success", "This booking is already paid!");
            return res.redirect(`/bookings/${booking._id}`);
        }
        
        // Create Razorpay payment order
        const paymentData = await razorpayConfig.createPaymentOrder({
            booking: booking,
            listing: booking.listing
        });
        
        // Save Razorpay order ID to booking
        booking.razorpayOrderId = paymentData.orderId;
        booking.paymentGateway = 'razorpay';
        await booking.save();
        
        // Render payment page with Razorpay checkout
        res.render("payments/razorpay-checkout", {
            booking: booking,
            listing: booking.listing,
            paymentData: paymentData,
            keyId: razorpayConfig.getKeyId()
        });
        
    } catch (error) {
        console.error("Error initiating Razorpay payment:", error.message);
        console.error("Full error:", error);
        
        let errorMessage = "Failed to initiate payment!";
        if (error.message && error.message.includes("Invalid API Key")) {
            errorMessage = "Payment system is not properly configured. Please contact the administrator.";
        }
        
        req.flash("error", errorMessage);
        return res.redirect(`/bookings/${req.params.bookingId}`);
    }
};

// Verify payment and confirm booking
module.exports.verifyPayment = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            req.flash("error", "Invalid payment verification data!");
            return res.redirect(`/bookings/${bookingId}`);
        }
        
        // Verify the signature
        const isValidSignature = razorpayConfig.verifyPaymentSignature({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        });
        
        if (!isValidSignature) {
            req.flash("error", "Payment verification failed! Signature mismatch.");
            return res.redirect(`/bookings/${bookingId}`);
        }
        
        // Get payment details from Razorpay
        const paymentDetails = await razorpayConfig.getPaymentDetails(razorpay_payment_id);
        
        if (paymentDetails.status !== 'captured') {
            req.flash("error", "Payment was not successful!");
            return res.redirect(`/bookings/${bookingId}`);
        }
        
        // Update booking payment status
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            req.flash("error", "Booking not found!");
            return res.redirect("/my-bookings");
        }
        
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        booking.razorpayPaymentId = razorpay_payment_id;
        booking.razorpaySignature = razorpay_signature;
        await booking.save();
        
        req.flash("success", "Payment successful! Your booking is confirmed.");
        res.redirect(`/bookings/${bookingId}`);
        
    } catch (error) {
        console.error("Error verifying Razorpay payment:", error);
        req.flash("error", "Failed to verify payment!");
        return res.redirect(`/bookings/${req.params.bookingId}`);
    }
};

// Payment success handler (called after successful payment)
module.exports.paymentSuccess = async (req, res, next) => {
    try {
        const { booking_id } = req.body;
        
        if (!booking_id) {
            req.flash("error", "Invalid payment callback!");
            return res.redirect("/my-bookings");
        }
        
        const booking = await Booking.findById(booking_id);
        
        if (booking) {
            booking.paymentStatus = 'paid';
            booking.status = 'confirmed';
            await booking.save();
            
            req.flash("success", "Payment successful! Your booking is confirmed.");
        }
        
        res.redirect(`/bookings/${booking_id}`);
        
    } catch (error) {
        console.error("Error processing payment success:", error);
        req.flash("error", "Failed to process payment confirmation!");
        return res.redirect("/my-bookings");
    }
};

// Payment cancel handler
module.exports.paymentCancel = async (req, res, next) => {
    try {
        const { booking_id } = req.body;
        
        if (booking_id) {
            const booking = await Booking.findById(booking_id);
            
            if (booking) {
                // Delete the pending booking since payment was cancelled
                await Booking.findByIdAndDelete(booking_id);
                req.flash("info", "Payment was cancelled. Your booking has been removed.");
            }
        }
        
        res.redirect("/my-bookings");
        
    } catch (error) {
        console.error("Error processing payment cancel:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/my-bookings");
    }
};

// Get payment status for a booking
module.exports.getPaymentStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        
        // Check if user owns this booking or is the host
        const listing = await Listing.findById(booking.listing);
        
        const isGuest = booking.user.equals(req.user._id);
        const isHost = listing && listing.owner.equals(req.user._id);
        
        if (!isGuest && !isHost) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        
        res.json({
            paymentStatus: booking.paymentStatus,
            totalPrice: booking.totalPrice,
            status: booking.status,
            paymentGateway: booking.paymentGateway
        });
        
    } catch (error) {
        console.error("Error fetching payment status:", error);
        res.status(500).json({ error: "Failed to fetch payment status" });
    }
};

// Webhook handler for Razorpay (optional - for real-time updates)
module.exports.handleWebhook = async (req, res, next) => {
    const crypto = require("crypto");
    const secret = process.env.RAZORPAY_KEY_SECRET;
    
    // Verify webhook signature
    const signature = req.headers["x-razorpay-signature"];
    
    try {
        const body = JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");
        
        if (signature !== expectedSignature) {
            console.error("Webhook signature verification failed!");
            return res.status(400).send("Invalid signature");
        }
        
        const event = req.body;
        
        // Handle payment.captured event
        if (event.event === "payment.captured") {
            const payment = event.payload.payment.entity;
            
            // Find booking by order ID or receipt
            const booking = await Booking.findOne({ razorpayOrderId: payment.order_id });
            
            if (booking && booking.paymentStatus !== 'paid') {
                booking.paymentStatus = 'paid';
                booking.status = 'confirmed';
                booking.razorpayPaymentId = payment.id;
                await booking.save();
                
                console.log(`Payment captured for booking ${booking._id}`);
            }
        }
        
        // Handle payment.failed event
        if (event.event === "payment.failed") {
            const payment = event.payload.payment.entity;
            console.log(`Payment failed: ${payment.id}`);
        }
        
        res.json({ received: true });
        
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({ error: "Webhook processing failed" });
    }
};
