import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config(); // Ensure this is called to load environment variables

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
if (!stripeSecretKey) {
  throw new Error('Stripe secret key is not defined');
}

export const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });
