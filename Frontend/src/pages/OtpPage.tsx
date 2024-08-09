import React, { useState, useEffect } from "react";
import { Button, TextField, Backdrop, CircularProgress, Typography, Grid, Box, IconButton } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyOtp, resendOtp } from "../Services/api";
import HomeIcon from "@mui/icons-material/Home";


const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = (location.state as { email?: string }) || {};

  useEffect(() => {
    if (timer === 0) {
      setIsResendDisabled(false);
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.info("Email is not available in location state");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp({ email, otp });
      toast.success("please login");
      navigate("/login");
    } catch (error) {
      // console.error(error);
      toast.error("Invalid otp.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.info("Email is not available in location state");
      return;
    }

    setLoading(true);

    try {
      await resendOtp({ email });
      setTimer(60);
      setIsResendDisabled(true);
      toast.success("OTP has been resent.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to resend OTP. Please try again.");
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
        <Box
          component="form"
          className="bg-white shadow-2xl rounded-lg p-10 w-full max-w-md mx-4"
          onSubmit={handleSubmit}
        >
          <Typography variant="h4" className="text-center text-gray-900 font-bold mb-6" gap={2}>
            Enter Your OTP 
          </Typography >
          <br />
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} gap={2}>
              <TextField
                value={otp}
                onChange={handleChange}
                type="text"
                className="w-full"
                label="OTP"
                variant="outlined"
                InputLabelProps={{
                  className: "text-gray-900",
                }}
                InputProps={{
                  className: "text-gray-900",
                  style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '1rem' },
                }}
                placeholder="● ● ● ● ● ●"
                sx={{
                  "& .MuiInputBase-input": {
                    height: '3rem', // Increase height
                    fontSize: '1.5rem', // Increase font size
                    textAlign: 'center',
                    letterSpacing: '0.5rem',
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: '8px', // Rounded corners
                  },
                  mb: 4, // Margin bottom
                }}
              />
            </Grid>
          </Grid>
          <Box mt={2} display="flex" flexDirection="column" gap={2}>
            <Button
              type="submit"
              className="bg-green-600 text-white font-bold py-2"
              variant="contained"
              sx={{
                height: '3rem', // Match height with OTP input
                fontSize: '1rem',
                borderRadius: '8px',
              }}
            >
              Verify OTP
            </Button>
            <Button
              onClick={handleResendOtp}
              disabled={isResendDisabled}
              className={`bg-gray-600 text-white font-bold py-2 ${isResendDisabled ? 'opacity-50' : ''}`}
              variant="contained"
              sx={{
                height: '3rem', // Match height with OTP input
                fontSize: '1rem',
                borderRadius: '8px',
              }}
            >
              {isResendDisabled ? `Resend OTP (${timer}s)` : "Resend OTP"}
            </Button>
          </Box>
          <p className="text-center text-sm text-gray-900 mt-4">
            Back to
            <Link to="/login">
              <span className="font-bold text-yellow-400 ml-1 cursor-pointer">
                Login
              </span>
            </Link>
          </p>
        </Box>
        <Link to="/" className="fixed top-0 left-0 m-4">
        <IconButton>
          <HomeIcon fontSize="large" className="text-white" />
        </IconButton>
      </Link>
      </div>
    </>
  );
};

export default VerifyOtp;
