import Stripe from 'stripe'

// No apiVersion pinned on purpose — this lets the SDK use your Stripe account's
// current default API version instead of a hardcoded string that can drift out of
// sync with the installed `stripe` package over time.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
