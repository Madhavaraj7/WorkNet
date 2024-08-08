import {
  Button,
  FormControl,
  IconButton,
  Input,
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
  username: string;
  email: string;
  password: string;
  profileImage: string | File;
}

const Auth: React.FC<AuthProps> = ({ insideSignup, setAdminEmail }) => {
  const { setIsAuthorized }: any = useContext(
    tokenAuthenticationContext
  );
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    password: "",
    profileImage: "",
  });
  const [preview, setPreview] = useState<string>("");

  const handleSignUp = async () => {
    const { username, email, password, profileImage } = user;
    if (!username || !email || !password) {
      toast.info("Please fill the form completely!!!");
      return;
    }

    const reqBody = new FormData();
    reqBody.append("username", username);
    reqBody.append("email", email);
    reqBody.append("password", password);
    reqBody.append("profileImage", preview ? profileImage : UserPlaceHolder);
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
    if (!email || !password) {
      toast.info("Please fill the form Completely!!!");
      return;
    }

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
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                type="text"
                className="w-full"
                id="standard-basic"
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
              id="standard-basic"
              label="Email"
              variant="standard"
              InputLabelProps={{
                className: "text-white",
              }}
              InputProps={{
                className: "text-white",
              }}
            />
            <FormControl sx={{ width: "100%" }} variant="standard">
              <InputLabel
                htmlFor="standard-adornment-password"
                className="text-white"
              >
                Password
              </InputLabel>
              <Input
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                value={user.password}
                id="standard-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      className="text-white"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                className="text-white"
              />
            </FormControl>
            {insideSignup ? (
              <Button
                onClick={handleSignUp}
                style={{
                  width: "100%",
                  background: "rgb(22 180 74 / var(--tw-bg-opacity))",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
                className="bg-green-600"
                variant="contained"
              >
                SignUp
              </Button>
            ) : (
              <Button
                onClick={handleLogin}
                style={{
                  width: "100%",
                  background: "rgb(22 180 74 / var(--tw-bg-opacity))",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
                className="bg-green-600"
                variant="contained"
              >
                LogIn
              </Button>
            )}
            {!insideSignup && (
              <div>
                <p className="text-center font-bold text-white">OR</p>
                <Button
                  variant="outlined"
                  className="w-full"
                  style={{
                    color: "#1c1b1b",
                    background: "white",
                    textTransform: "capitalize",
                  }}
                  startIcon={<img className="w-5 h-5" src={Google} alt="" />}
                >
                  SignIn with Google
                </Button>
              </div>
            )}
            {insideSignup ? (
              <p className="text-center text-sm text-white">
                Already have an account?
                <Link to="/login">
                  <span className="font-bold text-sm ml-1 text-yellow-400 cursor-pointer">
                    Login
                  </span>
                </Link>
              </p>
            ) : (
              <p className="text-center text-sm text-white">
                Don't have an account?
                <Link to="/signup">
                  <span className="font-bold text-sm ml-1 text-yellow-400 cursor-pointer">
                    SignUp
                  </span>
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
      <Link to="/" className="fixed top-0 left-0 m-4">
        <IconButton>
          <HomeIcon fontSize="large" className="text-white" />
        </IconButton>
      </Link>
    </>
  );
};

export default Auth;
