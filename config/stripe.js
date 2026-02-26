// Initialize Stripe with secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
    stripe: stripe,
    
    // Get publishable key for frontend
    getPublishableKey: () => {
        return process.env.STRIPE_PUBLISHABLE_KEY;
    },
    
    // Create checkout session for payment
    createCheckoutSession: async ({ booking, listing, domainUrl }) => {
        // Calculate number of nights
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `Stay at ${listing.title}`,
                            description: `${nights} night${nights > 1 ? 's' : ''} in ${listing.location}, ${listing.country}`,
                            images: listing.image ? [listing.image.url] : [],
                        },
                        unit_amount: Math.round(booking.totalPrice * 100), // Stripe expects amount in paise (for INR)
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${domainUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
            cancel_url: `${domainUrl}/payments/cancel?booking_id=${booking._id}`,
            customer_email: booking.guestEmail,
            metadata: {
                booking_id: booking._id.toString(),
                listing_id: listing._id.toString(),
                user_id: booking.user.toString(),
            },
        });
        
        return session;
    },
    
    // Verify and retrieve checkout session
    retrieveSession: async (sessionId) => {
        return await stripe.checkout.sessions.retrieve(sessionId);
    },
    
    // Construct webhook event
    constructWebhookEvent: (payload, signature, webhookSecret) => {
        return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }
};
