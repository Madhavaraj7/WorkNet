import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm"; // Create this component

// Make sure to replace with your own publishable key
const stripePromise = loadStripe("pk_test_51MWBZUSFYLZi23L4T1FEBPHNGRC5u1uSzsXntd6iwtKOQcTBRJMoARdSSAAqQswE55vrKvH5eWMrBCuO4ad0ZaLV00jgftxjNw");

function StripeCheckout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default StripeCheckout;
