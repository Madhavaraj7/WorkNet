import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordAPI, VerifyResetPasswordAPI } from "../Services/allAPI";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isEmailValid = () => email.trim() !== "";

  const isOtpValid = () => otp.trim() !== "";

  const isPasswordValid = () =>
    newPassword.trim() !== "" && confirmPassword.trim() !== "";

  const doPasswordsMatch = () => newPassword === confirmPassword;

  const isNewPasswordValid = () => {
    return newPassword.length >= 6;
  };

  const handleEmailSubmit = async () => {
    if (!isEmailValid()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setError("");
      await ForgotPasswordAPI(email);
      toast.success("OTP has been sent to your email.");
      setStep(2);
    } catch (err) {
      setError("Failed to send OTP. Please check your email and try again.");
      toast.error("Failed to send OTP. Please check your email and try again.");
    }
  };

  const handlePasswordReset = async () => {
    if (!isOtpValid()) {
      setError("Please enter the OTP.");
      return;
    }

    if (!isPasswordValid()) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (!doPasswordsMatch()) {
      setError("Passwords do not match.");
      return;
    }

    if (!isNewPasswordValid()) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setError("");
      let result = await VerifyResetPasswordAPI(email, otp, newPassword);
      console.log(result);

      if (result.error) {
        setError(
          "Failed to reset password. Please check your OTP and try again."
        );
        toast.error(
          "Failed to reset password. Please check your OTP and try again."
        );
      } else {
        toast.success("Password reset successful!");
        setStep(3);
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      toast.error("An error occurred during signup. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {step === 1 && (
            <div>
              <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
                Forgot Password
              </h2>
              <input
                type="email"
                className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
                onClick={handleEmailSubmit}
              >
                Send OTP
              </button>
              <button
                className="w-full bg-gray-500 text-white py-3 rounded-md mt-4 hover:bg-gray-600 transition"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <button
                className="text-blue-500 mb-4 hover:underline"
                onClick={() => setStep(1)}
              >
                &larr; Back
              </button>
              <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
                Verify OTP
              </h2>
              <input
                type="text"
                className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <input
                type="password"
                className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                className="w-full p-4 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition"
                onClick={handlePasswordReset}
              >
                Reset Password
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-3xl font-extrabold mb-6 text-center text-green-600">
                Password Reset Successful
              </h2>
              <p className="text-center mb-4 text-gray-600">
                Your password has been reset. You will be redirected to the
                login page shortly.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;
