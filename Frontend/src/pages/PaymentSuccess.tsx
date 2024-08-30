import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../Services/serverURL";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const sessionId = query.get("session_id"); 
  console.log("Session ID:", sessionId);
  const token = localStorage.getItem("token") || ""; 


  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        console.error("No session ID found");
        return;
      }

      try {
        const response = await fetch(
          `${SERVER_URL}/payments/confirm?session_id=${sessionId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          console.log("Payment confirmed");
          toast.success("Payment confirmed! Your booking is successful.");
        } else {
          throw new Error("Payment not confirmed");
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
        toast.error("There was an issue confirming your payment.");
      }
    };

    confirmPayment();
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p className="mb-6">
        Thank you for your booking. Your payment has been processed
        successfully.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Go Home
      </button>
    </div>
  );
};

export default PaymentSuccess;
