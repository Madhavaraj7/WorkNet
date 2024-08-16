import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  InputAdornment,
  TextField,
  Backdrop,
  CircularProgress,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AdminLoginAPI } from "../../Services/allAPI"; 
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { tokenAuthenticationContext } from "../../ContextAPI/AdminAuth"; 

const AdminAuth: React.FC = () => {
  const { setIsAuthorized,setAdmin,admin }: any = useContext(tokenAuthenticationContext); // Consume setAdmin from context

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      toast.info("Please fill in all fields!");
      return false;
    }

    if (/\s/.test(email) || /\s/.test(password)) {
      toast.info("Fields should not contain spaces!");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.info("Please enter a valid email address!");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await AdminLoginAPI({ email, password });
      setLoading(false);
      console.log(result);
      
      if (result && result.user && result.token) {
        localStorage.setItem("adtoken", result.token);
        localStorage.setItem("admin", JSON.stringify(result.user));
        setIsAuthorized(true);
        setAdmin(result.user); 
        toast.success("Login Successful!");
        navigate("/adhome");
      } else {
        toast.error("Invalid login credentials. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  useEffect(()=>{
    if(admin?.email){
      navigate("/adusers");
    }
  },[admin])

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress size={60} color="primary" />
      </Backdrop>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        className="bg-gray-900"
        p={2}
      >
        <Paper
          elevation={12}
          sx={{
            display: "flex",
            borderRadius: 3,
            width: "80%",
            maxWidth: 600,
            height: "70vh",
            overflow: "hidden",
            boxShadow: "0px 6px 20px rgba(0,0,0,0.3)",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#ffffff",
              borderRadius: "3px 0 0 3px",
              p: 3,
              boxShadow: "inset 0 0 15px rgba(0,0,0,0.2)",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              align="center"
              gutterBottom
              sx={{
                color: " #111827",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              Welcome Admin
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: "#111827",
              borderRadius: "0 3px 3px 0",
              p: 3,
              boxShadow: "inset 0 0 15px rgba(0,0,0,0.3)",
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              align="center"
              gutterBottom
              sx={{
                color: "#ffff",
                mb: 3,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Admin Login
            </Typography>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              fullWidth
              margin="normal"
              label="Email"
              variant="outlined"
              size="small"
              InputProps={{
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#2d3748",
                    "& input": {
                      color: "#fff",
                    },
                    "& fieldset": {
                      borderColor: "#4a5568",
                    },
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: "#cbd5e0",
                },
              }}
            />
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              label="Password"
              variant="outlined"
              size="small"
              InputProps={{
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#2d3748",
                    "& input": {
                      color: "#fff",
                    },
                    "& fieldset": {
                      borderColor: "#4a5568",
                    },
                  },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      sx={{ color: '#cbd5e0' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: {
                  color: "#cbd5e0",
                },
              }}
            />
            <Button
              onClick={handleLogin}
              className="w-full text-white bg-gradient-to-r from-[#FF5733] to-[#FFC300] border-0 hover:bg-gradient-to-l py-2 px-4 focus:outline-none rounded text-lg"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                backgroundColor: "#3182ce",
                "&:hover": { backgroundColor: "#2b6cb0" },
              }}
            >
              Login
            </Button>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mt: 2, color: "#cbd5e0" }}
            >
              &copy; {new Date().getFullYear()} WORKNET
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default AdminAuth;
