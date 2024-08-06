import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';

const Header: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-gray-900 text-white py-4 fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        <div className="text-2xl font-bold flex items-center space-x-2">
          <EngineeringIcon fontSize="large" className="text-teal-400" />
          <Link to="/" className="hover:text-teal-400">WorkNet</Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <button onClick={() => scrollToSection('home')} className="hover:text-teal-400">Home</button>
          <button onClick={() => scrollToSection('about')} className="hover:text-teal-400">About</button>
          <button onClick={() => scrollToSection('services')} className="hover:text-teal-400">Services</button>
          <button onClick={() => scrollToSection('Footer')} className="hover:text-teal-400">Contact</button>
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button
              variant="outlined"
              color="inherit"
              className="border-teal-400 text-teal-400 hover:bg-teal-500 hover:text-white"
            >
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              variant="contained"
              color="primary"
              className="bg-teal-500 hover:bg-teal-600"
            >
              Signup
            </Button>
          </Link>
        </div>
        <button className="md:hidden text-white hover:text-teal-400">
          {/* Mobile menu button */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
