# Stripe Setup Guide

## How to Get Your Stripe API Keys

### Step 1: Create a Stripe Account
1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Click "Sign up" if you don't have an account
3. It's free to sign up and use test mode

### Step 2: Get Your API Keys
1. In Stripe Dashboard, click **Developers** → **API keys**
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`) - Used in frontend
   - **Secret key** (starts with `sk_test_`) - Used in backend

### Step 3: Get Webhook Signing Secret

**Option A: For Local Development (Recommended)**
You don't need to create a webhook in Stripe dashboard. Instead, use Stripe CLI:

1. Install Stripe CLI:
   - macOS: `brew install stripe/stripe-cli/stripe`
   - Windows: Download from https://github.com/stripe/stripe-cli/releases
   - Linux: Use package manager or download

2. Login: `stripe login`

3. Run this command to forward webhooks:
   
```
   stripe listen --forward-to localhost:8080/webhook
   
```

4. Copy the webhook secret shown (starts with `whsec_`) to your `.env`

**Option B: For Production**
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Fill in:
   - **Endpoint URL**: `https://hosthaven.onrender.com/webhook`
   - **Description**: "HostHaven Payment Events"
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Click **Reveal** next to "Signing secret"
7. Copy the signing secret to your `.env`

### Step 4: Configure Your .env File
Add these to your `.env` file:
```
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx
```

### Step 5: Restart Your Server
After adding the keys, restart your Node.js server.

---

## Testing Payments
- Use Stripe's [test card numbers](https://stripe.com/docs/testing):
  - Card: `4242 4242 4242 4242`
  - Exp: Any future date (e.g., `12/30`)
  - CVC: Any 3 digits (e.g., `123`)

---

## Troubleshooting
If "Pay Now" doesn't redirect to Stripe:
1. Check server console for errors
2. Verify `.env` has valid `STRIPE_SECRET_KEY`
3. Make sure the key starts with `sk_test_` (not `rk_`)
4. Restart the server after changing `.env`
