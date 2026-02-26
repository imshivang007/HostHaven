const Razorpay = require("razorpay");

// Initialize Razorpay with API keys from environment variables
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = {
    razorpay: razorpay,
    
    // Get publishable key for frontend
    getKeyId: () => {
        return process.env.RAZORPAY_KEY_ID;
    },
    
    // Create payment order for a booking
    createPaymentOrder: async ({ booking, listing }) => {
        // Calculate number of nights
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        // Create order in Razorpay (amount is in paise)
        const options = {
            amount: Math.round(booking.totalPrice * 100), // Convert to paise
            currency: "INR",
            receipt: `booking_${booking._id}`,
            notes: {
                booking_id: booking._id.toString(),
                listing_id: listing._id.toString(),
                user_id: booking.user.toString(),
                guest_email: booking.guestEmail,
                guest_name: booking.guestName
            }
        };
        
        const order = await razorpay.orders.create(options);
        
        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            bookingId: booking._id,
            listingTitle: listing.title,
            guestName: booking.guestName,
            guestEmail: booking.guestEmail,
            nights: nights,
            location: listing.location,
            country: listing.country
        };
    },
    
    // Verify payment signature
    verifyPaymentSignature: (options) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = options;
        
        const crypto = require("crypto");
        const secret = process.env.RAZORPAY_KEY_SECRET;
        
        // Create signature to verify
        const generatedSignature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");
        
        return generatedSignature === razorpay_signature;
    },
    
    // Get payment details
    getPaymentDetails: async (paymentId) => {
        return await razorpay.payments.fetch(paymentId);
    },
    
    // Refund payment (for future use)
    refundPayment: async (paymentId, amount) => {
        return await razorpay.payments.refund(paymentId, {
            amount: amount // amount in paise
        });
    }
};
