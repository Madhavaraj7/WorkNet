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
import { toast } from "react-toastify";
import { LoginAPI, SignUpAPI,GoogleLoginAPI } from "../Services/allAPI";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebase";
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

const Auth: React.FC<AuthProps> = ({ insideSignup }) => {
  const { setIsAuthorized }: any = useContext(tokenAuthenticationContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });
  const [preview, setPreview] = useState<string>("");
  const [googleLogin,setGoogleLogin]=useState({
    username: "",
    email: "",
    password: "",
    profileImage: "",
  })

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

    if (
      /\s/.test(email) ||
      /\s/.test(password) ||
      (username && /\s/.test(username))
    ) {
      toast.info("Fields should not contain spaces!");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.info("Please enter a valid email address!");
      return false;
    }

    if (
      insideSignup &&
      (!profileImage ||
        (typeof profileImage === "string" && profileImage === UserPlaceHolder))
    ) {
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
    reqBody.append(
      "profileImage",
      preview ? (profileImage as File) : UserPlaceHolder
    );
    const reqHeader = {
      "Content-Type": preview ? "multipart/form-data" : "application/json",
    };

    try {
      const result = await SignUpAPI(reqBody, reqHeader);
      console.log('SignUpAPI result:', result); // Debugging line

      if (result?.status === 400) {
        toast.error("This email is already registered!");
      } else if (result) {
        toast.success("OTP sent, please check your mail.");
        navigate("/otp", { state: { email: user.email } });
      }
    } catch (err) {
      // console.error('SignUpAPI error:', err); // Debugging line
      toast.error("An error occurred during signup. Please try again.");
    }
  };

  const handleLogin = async () => {
    const { email, password } = user;
    if (!validateForm(email, password)) return;

    try {
      setOpen(true);
      const result = await LoginAPI(user);
      // console.log('LoginAPI result:', result); // Debugging line
      setOpen(false);

      if (result && result.user && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setIsAuthorized(true);
        setUser(result.user);

        toast.success("Login Successful!");
        navigate("/");
      } else {
        toast.error("Invalid login credentials. Please try again.");
      }
    } catch (err) {
      setOpen(false);
      // console.error('LoginAPI error:', err); // Debugging line
      toast.error("An error occurred during login. Please try again.");
    }
  };
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      setGoogleLogin({
        email: result.user.email!,
        username: result.user.displayName!,
        profileImage: result.user.photoURL!,
        password: "",
      });
    } catch (error) {
      toast.error("Google login failed. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    if (googleLogin.email) {
      try {
        const googleLoginResult = await GoogleLoginAPI(googleLogin);
        console.log(googleLoginResult);
        
        if (googleLoginResult && googleLoginResult.user && googleLoginResult.token) {
          localStorage.setItem("token", googleLoginResult.token);
          localStorage.setItem("user", JSON.stringify(googleLoginResult.user));
          toast.success("Login Successful!");

          navigate("/");
          setIsAuthorized(true);
        } else {
          toast.error("Google authentication failed. Please try again.");
        }
      } catch (err) {
        toast.error("An error occurred during Google authentication. Please try again.");
      }
    }
  };


  useEffect(() => {
    if (user.profileImage instanceof File) {
      setPreview(URL.createObjectURL(user.profileImage));
    }
  }, [user.profileImage]);

  useEffect(() => {
    if (googleLogin.email) {
      handleGoogleSignUp();
    }
  }, [googleLogin]);


  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        toast.error("Please select a valid image file (.jpg, .png).");
        return;
      }
      setUser({ ...user, profileImage: file });
    }
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
              <div className="flex justify-center flex-col items-center h-full">
              <EngineeringIcon
                fontSize="large"
                style={{ fontSize: "80px" }}
                className="mb-5 font-bold text-gray-900"
              />
              <h1 className="text-5xl font-bold w-80 text-center text-gray-900">
                WELCOME <span className="text-yellow-400">BACK</span>
              </h1>
            </div>
            )}
          </div>
          <div className="space-y-10 px-10 bg-gray-900 py-12">
            {insideSignup && (
              <div className="flex justify-center items-center mt-10">
                <label className="text-center">
                  <input
                    onChange={handleFileChange}
                    className="hidden"
                    type="file"
                    accept=".jpg, .png"
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
              className="w-full"
              label="Password"
              variant="standard"
              InputLabelProps={{
                className: "text-white",
              }}
              InputProps={{
                className: "text-white",
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
              }}
            />
            
            <Button
              onClick={insideSignup ? handleSignUp : handleLogin}
              className="w-full text-white bg-gradient-to-r from-[#FF5733] to-[#FFC300] border-0 hover:bg-gradient-to-l py-2 px-4 focus:outline-none rounded text-lg"
            >
              {insideSignup ? "Sign Up" : "Login"}
            </Button>
           
            {!insideSignup && (
              <>
              <Link to="/forgot-password">
              <span className="font-bold text-red-600 ml-1 cursor-pointer">
                Forgot password?
              </span>
            </Link>
              
              
                <Button
                onClick={handleGoogleLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700 py-2 px-4 focus:outline-none rounded-lg text-lg transition-transform transform hover:scale-105 flex items-center justify-center"
                  startIcon={
                    <img
                      src={Google}
                      alt="Google logo"
                      className="w-6 h-6 mr-2"
                    />
                  }
                >
                  <span className="text-sm font-semibold text-white">
                    Sign in with Google
                  </span>
                </Button>
              </>
            )}
            
            
            <div className="text-center">
              <span className="text-white">
                {insideSignup
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <Link
                  to={insideSignup ? "/login" : "/signup"}
                  className="text-blue-500 font-bold hover:underline"
                >
                  {insideSignup ? "Login" : "Sign Up"}
                </Link>
              </span>
            </div>
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