import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import OtpPage from './pages/OtpPage';
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for Toastify
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const handleSetAdminEmail = (email: string): void => {
    // Implementation for setAdminEmail
    console.log('Admin email set to:', email);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Auth insideSignup={false} setAdminEmail={handleSetAdminEmail} />} />
        <Route path='/signup' element={<Auth insideSignup={true} setAdminEmail={handleSetAdminEmail} />} />
        <Route path='/otp' element={<OtpPage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>
    </>
  );
}

export default App;
