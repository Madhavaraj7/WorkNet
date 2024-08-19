import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import OtpPage from "./pages/OtpPage";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import ForgotPassword from "./pages/ForgotPassword";
import AdminAuth from "./pages/Admin/AdminAuth";
import AdHome from "./pages/Admin/AdHome";
import PrivateRoute from "./ContextAPI/PrivateRoute";
import AdminPrivateRoute from "./ContextAPI/AdminPrivateRoute";
import AuthRoute from "./ContextAPI/AuthRoute";
import AdProfile from "./pages/Admin/AdProfile";
import AdUsers from "./pages/Admin/AdUsers";
import AdminLayout from "./components/Admin/AdminLayout"; 
import WorkerRegister from "./pages/WorkerRegister";

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

        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Auth insideSignup={false} />} />
          <Route path="/signup" element={<Auth insideSignup={true} />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<WorkerRegister />} />

        </Route>

        <Route path="/admin" element={<AdminAuth />} />
        <Route element={<AdminPrivateRoute />}>
          <Route  element={<AdminLayout />}>
            <Route path="/adhome" element={<AdHome />} />
            <Route path="/adprofile" element={<AdProfile />} />
            <Route path="/adusers" element={<AdUsers />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
