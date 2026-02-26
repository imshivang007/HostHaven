const Booking = require("../models/booking");
const Listing = require("../models/listing");
const stripe = require("../config/stripe");
const ExpressError = require("../utils/ExpressError");

// Initiate payment for a booking
module.exports.initiatePayment = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        
        // Check if Stripe is configured
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error("Stripe secret key is not configured!");
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
        
        // Get domain URL
        const domainUrl = req.protocol + '://' + req.get('host');
        
        // Create Stripe checkout session
        const session = await stripe.createCheckoutSession({
            booking: booking,
            listing: booking.listing,
            domainUrl: domainUrl
        });
        
        // Save Stripe session ID to booking
        booking.stripeSessionId = session.id;
        await booking.save();
        
        // Redirect to Stripe checkout
        res.redirect(session.url);
        
    } catch (error) {
        console.error("Error initiating payment:", error.message);
        console.error("Full error:", error);
        
        let errorMessage = "Failed to initiate payment!";
        if (error.message && error.message.includes("You did not provide an API key")) {
            errorMessage = "Payment system is not properly configured. Please contact the administrator.";
        }
        
        req.flash("error", errorMessage);
        return res.redirect(`/bookings/${req.params.bookingId}`);
    }
};

// Payment success handler
module.exports.paymentSuccess = async (req, res, next) => {
    try {
        const { session_id, booking_id } = req.query;
        
        if (!session_id || !booking_id) {
            req.flash("error", "Invalid payment callback!");
            return res.redirect("/my-bookings");
        }
        
        // Retrieve session from Stripe
        const session = await stripe.retrieveSession(session_id);
        
        if (session.payment_status === 'paid') {
            // Update booking payment status
            const booking = await Booking.findById(booking_id);
            
            if (booking) {
                booking.paymentStatus = 'paid';
                booking.status = 'confirmed';
                booking.paymentIntentId = session.payment_intent;
                await booking.save();
                
                req.flash("success", "Payment successful! Your booking is confirmed.");
            } else {
                req.flash("error", "Booking not found!");
                return res.redirect("/my-bookings");
            }
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
        const { booking_id } = req.query;
        
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

// Stripe webhook handler
module.exports.handleWebhook = async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
        event = stripe.constructWebhookEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            
            try {
                const bookingId = session.metadata.booking_id;
                
                if (bookingId) {
                    const booking = await Booking.findById(bookingId);
                    
                    if (booking && booking.paymentStatus !== 'paid') {
                        booking.paymentStatus = 'paid';
                        booking.status = 'confirmed';
                        booking.paymentIntentId = session.payment_intent;
                        await booking.save();
                        
                        console.log(`Payment completed for booking ${bookingId}`);
                    }
                }
            } catch (error) {
                console.error("Error processing webhook checkout.session.completed:", error);
            }
            break;
            
        case 'payment_intent.payment_failed':
            const paymentIntent = event.data.object;
            console.log(`Payment failed: ${paymentIntent.id}`);
            break;
            
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    
    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
};

// Get payment status for a booking
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
