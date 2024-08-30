import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button, Typography } from "@mui/material";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      try {
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          "{CLIENT_SECRET_FROM_SERVER}",
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (error) {
          setError(error.message || "Payment failed");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
          // Notify server to save booking details
          await fetch("/api/booking/confirm", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: "user-id",
              workerId: "worker-id",
              slotId: "slot-id",
              amount: paymentIntent.amount,
            }),
          });
          // Handle successful payment (e.g., redirect or show success message)
        }
      } catch (error) {
        setError("Payment failed");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" variant="contained" color="primary" disabled={!stripe}>
        Confirm Booking
      </Button>
    </form>
  );
}

export default CheckoutForm;
