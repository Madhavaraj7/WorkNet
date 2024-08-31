import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../Services/serverURL";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faChrome } from "@fortawesome/free-brands-svg-icons";
import { faPhone, faHome } from "@fortawesome/free-solid-svg-icons";

interface Worker {
  phoneNumber: number;
  whatsappNumber: number;
}

const PaymentSuccess = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const sessionId = query.get("session_id");
  const [worker, setWorker] = useState<Worker | null>(null);
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
          // toast.success("Payment confirmed! Your booking is successful.");
          setWorker(data.worker);
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
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-700 text-center mb-6">
          Thank you for your booking. Your payment has been processed successfully.
        </p>

        {worker && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Connect with Worker
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => window.open(`https://wa.me/${worker.whatsappNumber}`, "_blank")}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-md transition-transform duration-300 transform hover:scale-105 w-32 justify-center"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="mr-2 text-lg" />
                  <span className="text-sm">WhatsApp</span>
                </button>
                <button
                  onClick={() => window.open(`tel:${worker.phoneNumber}`, "_self")}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-md transition-transform duration-300 transform hover:scale-105 w-32 justify-center"
                >
                  <FontAwesomeIcon icon={faPhone} className="mr-2 text-lg" />
                  <span className="text-sm">Call</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg transition-transform duration-300 transform hover:scale-105 mt-4 mx-auto"
        >
          <FontAwesomeIcon icon={faHome} className="mr-2 text-lg" />
          <span className="text-sm">Go Home</span>
        </button>
      </div>
    </div>

      <Footer />
    </>
  );
};

export default PaymentSuccess;
