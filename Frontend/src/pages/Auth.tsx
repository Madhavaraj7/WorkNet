import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Google from "../assets/Images/google.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import UserPlaceHolder from "../assets/Images/UserPlaceHolder.jpg";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginAPI, SignUpAPI } from "../Services/allAPI";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import EngineeringIcon from "@mui/icons-material/Engineering";
import LoginBack from "../assets/Images/LoginBack.png";
import { tokenAuthenticationContext } from "../ContextAPI/TokenAuth";

interface AuthProps {
  insideSignup: boolean;
  setAdminEmail: (email: string) => void;
}

interface User {
  username?: string;
  email: string;
  password: string;
  profileImage?: string | File;
}

const Auth: React.FC<AuthProps> = ({ insideSignup, setAdminEmail }) => {
  const { setIsAuthorized }: any = useContext(tokenAuthenticationContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });
  const [preview, setPreview] = useState<string>("");

  const validateForm = (
    email: string,
    password: string,
    username?: string,
    profileImage?: string | File
  ) => {
    if (insideSignup) {
      if (!username || !email || !password) {
        toast.info("Please fill the form completely!");
        return false;
      }
    } else {
      if (!email || !password) {
        toast.info("Please fill the form completely!");
        return false;
      }
    }

    if (/\s/.test(email) || /\s/.test(password) || (username && /\s/.test(username))) {
      toast.info("Fields should not contain spaces!");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.info("Please enter a valid email address!");
      return false;
    }

    if (insideSignup && (!profileImage || (typeof profileImage === 'string' && profileImage === UserPlaceHolder))) {
      toast.info("Please upload a profile picture!");
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    const { username, email, password, profileImage } = user;
    if (!validateForm(email, password, username, profileImage)) return;

    const reqBody = new FormData();
    reqBody.append("username", username || "");
    reqBody.append("email", email);
    reqBody.append("password", password);
    reqBody.append("profileImage", preview ? (profileImage as File) : UserPlaceHolder);
    const reqHeader = {
      "Content-Type": preview ? "multipart/form-data" : "application/json",
    };

    try {
      const result = await SignUpAPI(reqBody, reqHeader);

      if (result?.status === 400) {
        toast.error("This email is already registered!");
      } else if (result) {
        navigate("/otp", { state: { email: user.email } });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during signup. Please try again.");
    }
  };

  const handleLogin = async () => {
    const { email, password } = user;
    if (!validateForm(email, password)) return;

    try {
      setOpen(true);
      const result = await LoginAPI(user);
      setOpen(false);

      if (result && result.user && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setIsAuthorized(true);
        setUser(result.user); // Update user in context

        toast.success("Login Successful!");
        navigate("/");
      } else {
        toast.error("Invalid login credentials. Please try again.");
      }
    } catch (err) {
      setOpen(false);
      console.error(err);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  useEffect(() => {
    if (user.profileImage instanceof File) {
      setPreview(URL.createObjectURL(user.profileImage));
    }
  }, [user.profileImage]);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress size={60} color="warning" />
      </Backdrop>
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <ToastContainer
          autoClose={3000}
          position="top-center"
          theme="colored"
        />
        <div className="grid grid-cols-2 max-[650px]:grid-cols-1 w-[650px] shadow-2xl bg-white rounded-lg overflow-hidden">
          <div className="flex justify-center items-center max-[850px]:h-screen bg-white">
            {insideSignup ? (
              <div className="flex justify-center flex-col items-center h-full">
                <EngineeringIcon
                  fontSize="large"
                  style={{ fontSize: "80px" }}
                  className="mb-5 font-bold text-gray-900"
                />
                <h1 className="text-5xl font-bold w-80 text-center text-gray-900">
                  WELCOME TO <span className="text-yellow-400">WORKNET</span>
                </h1>
              </div>
            ) : (
              <img src={LoginBack} alt="" />
            )}
          </div>
          <div className="space-y-10 px-10 bg-gray-900 py-12">
            {!insideSignup && (
              <h1 className="text-center text-4xl mb-3 font-bold text-white">
                LOGIN
              </h1>
            )}
            {insideSignup && (
              <div className="flex justify-center items-center mt-10">
                <label className="text-center">
                  <input
                    onChange={(e) =>
                      setUser({ ...user, profileImage: e.target.files![0] })
                    }
                    className="hidden"
                    type="file"
                  />
                  <div
                    style={{
                      backgroundImage: `url(${
                        preview ? preview : UserPlaceHolder
                      })`,
                    }}
                    className="w-32 h-32 rounded-full bg-cover cursor-pointer relative flex justify-center items-center"
                  >
                    <AddAPhotoIcon
                      className="absolute bottom-2"
                      style={{ color: "white" }}
                    />
                  </div>
                </label>
              </div>
            )}
            {insideSignup && (
              <TextField
                value={user.username || ""}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                type="text"
                className="w-full"
                id="username"
                label="Username"
                variant="standard"
                InputLabelProps={{
                  className: "text-white",
                }}
                InputProps={{
                  className: "text-white",
                }}
              />
            )}
            <TextField
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              type="email"
              className="w-full"
              id="email"
              label="Email"
              variant="standard"
              InputLabelProps={{
                className: "text-white",
              }}
              InputProps={{
                className: "text-white",
              }}
            />
            <TextField
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              type={showPassword ? "text" : "password"}
              id="password"
              label="Password"
              variant="standard"
              InputLabelProps={{
                className: "text-white",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                className: "text-white",
              }}
            />
            <div className="flex justify-center flex-col items-center space-y-5">
              {insideSignup && (
                <Button
                  onClick={handleSignUp}
                  className="w-full bg-yellow-400 text-gray-900"
                  variant="contained"
                >
                  Sign Up
                </Button>
              )}
              {!insideSignup && (
                <Button
                  onClick={handleLogin}
                  className="w-full bg-yellow-400 text-gray-900"
                  variant="contained"
                >
                  Log In
                </Button>
              )}
              <div className="flex justify-center items-center">
                {insideSignup ? (
                  <p className="text-white text-sm">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-yellow-400 font-semibold ml-1"
                    >
                      Log In
                    </Link>
                  </p>
                ) : (
                  <p className="text-white text-sm">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-yellow-400 font-semibold ml-1"
                    >
                      Sign Up
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
