import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import OtpPage from "./pages/OtpPage";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for Toastify
import ForgotPassword from "./pages/ForgotPassword";
import AdminAuth from "./pages/Admin/AdminAuth";
import AdHome from "./pages/Admin/AdHome";
import PrivateRoute from "./ContextAPI/PrivateRoute"; // Updated import
import AdminPrivateRoute from "./ContextAPI/AdminPrivateRoute"; // Updated import
import AdProfile from "./pages/Admin/AdProfile";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth insideSignup={false} />} />
        <Route path="/signup" element={<Auth insideSignup={true} />} />
        <Route path="/otp" element={<OtpPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>{" "}
        <Route path="/admin" element={<AdminAuth />} />
        <Route element={<AdminPrivateRoute />}>
          <Route path="/adhome" element={<AdHome />} />
          <Route path="/adProfile" element={<AdProfile />} />

        </Route>
      </Routes>
    </>
  );
}

export default App;
