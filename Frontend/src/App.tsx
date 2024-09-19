import  { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { DNA } from 'react-loader-spinner';  // Import Dna from react-loader-spinner
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
import WorkerApprov from "./pages/Admin/WorkerApprov";
import AdWorkers from "./pages/Admin/AdWorkers";
import Workers from "./pages/Workers";
import Worker from "./pages/Worker";
import AdCategory from "./pages/Admin/AdCategory";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyBooking from "./pages/MyBooking";
import AdReviews from "./pages/Admin/AdReviews";
import AdRevenue from "./pages/Admin/AdRevenue";
import Help from "./pages/Help";
import Chat from "./pages/Admin/Chat";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 1000); 

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center items-center fixed inset-0 bg-white z-50">
          <DNA
            visible={true}
            height="80"  
            width="80"   
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      )}
      

      {/* Toast notifications */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Auth insideSignup={false} />} />
          <Route path="/signup" element={<Auth insideSignup={true} />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="/workers" element={<Workers />} />
        <Route path="/worker/:wId" element={<Worker />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<WorkerRegister />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/myBooking" element={<MyBooking />} />
          <Route path="/Help" element={<Help />} />
        </Route>

        <Route path="/admin" element={<AdminAuth />} />
        <Route element={<AdminPrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/adhome" element={<AdHome />} />
            <Route path="/adprofile" element={<AdProfile />} />
            <Route path="/adusers" element={<AdUsers />} />
            <Route path="/adapprove" element={<WorkerApprov />} />
            <Route path="/adworkers" element={<AdWorkers />} />
            <Route path="/adCategory" element={<AdCategory />} />
            <Route path="/adreviews" element={<AdReviews />} />
            <Route path="/adrevenue" element={<AdRevenue />} />
            <Route path="/admessages" element={<Chat />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
