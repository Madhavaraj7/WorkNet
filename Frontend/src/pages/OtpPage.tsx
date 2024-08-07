import React, { useState } from "react";
import { Button, TextField, Backdrop, CircularProgress, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeIcon from "@mui/icons-material/Home";
import { VerifyOTPAPI } from "../Services/allAPI"; // Update path as necessary

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOTP = async () => {
    if (!otp) {
        toast.info("Please enter the OTP!");
        return;
    }

    setLoading(true);

    try {
        const result = await VerifyOTPAPI( otp ); // Wrap otp in an object if the server expects it that way

        if (result.error) {
            toast.error(result.message || "Invalid OTP, please try again.");
        } else {
            navigate("/dashboard"); // Navigate to the desired page on success
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        toast.error("An error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
};

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress size={60} color="warning" />
      </Backdrop>
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <ToastContainer autoClose={3000} position="top-center" theme="colored" />
        <div className="grid grid-cols-1 w-[650px] shadow-2xl bg-white rounded-lg overflow-hidden">
          <div className="flex justify-center items-center bg-gray-900">
          </div>
          <div className="space-y-10 px-10 py-12">
            <Typography variant="h4" className="text-center text-gray-900 font-bold mb-4">
              Enter Your OTP
            </Typography>
            <TextField
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              className="w-full"
              label="OTP"
              variant="standard"
              InputLabelProps={{
                className: "text-gray-900",
              }}
              InputProps={{
                className: "text-gray-900",
              }}
            />
            <Button
              onClick={handleVerifyOTP}
              style={{
                width: "100%",
                background: "rgb(22 180 74 / var(--tw-bg-opacity))",
                fontSize: "16px",
                fontWeight: "bold",
              }}
              className="bg-green-600"
              variant="contained"
            >
              Verify OTP
            </Button>
            <p className="text-center text-sm text-gray-900">
              Back to
              <Link to="/login">
                <span className="font-bold text-sm ml-1 text-yellow-400 cursor-pointer">
                  Login
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Link to="/" className="fixed top-0 left-0 m-4">
        <Button>
          <HomeIcon fontSize="large" className="text-white" />
        </Button>
      </Link>
    </>
  );
};

export default OTPVerification;
