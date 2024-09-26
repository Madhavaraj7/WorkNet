import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined");
}

export const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

export const processStripePayment = async (
  amount: number,
  stripeToken: string
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "inr",
      payment_method: stripeToken,
      confirm: true,
    });

    return { success: true, paymentIntent };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
