import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import OtpPage from './pages/OtpPage';

function App() {
  const handleSetAdminEmail = (email: string): void => {
    // Implementation for setAdminEmail
    console.log('Admin email set to:', email);
  };

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Auth insideSignup={false} setAdminEmail={handleSetAdminEmail} />} />
      <Route path='/signup' element={<Auth insideSignup={true} setAdminEmail={handleSetAdminEmail} />} />
      <Route path='/otp' element={<OtpPage  />} />

    </Routes>
  );
}

export default App;
