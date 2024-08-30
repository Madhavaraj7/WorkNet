// src/StripeProvider.tsx
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(''); // Replace with your Stripe publishable key

const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Elements stripe={stripePromise}>
    {children}
  </Elements>
);

export default StripeProvider;
