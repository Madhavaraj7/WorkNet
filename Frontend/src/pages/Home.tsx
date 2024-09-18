import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import construction from '../assets/Images/Construction.jpg';
import Carpenter from '../assets/Images/carpenters.png';
import electric from '../assets/Images/Electric.jpg';
import { Button } from '@mui/material';
import ForwardIcon from '@mui/icons-material/Forward';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import ConstructionWork from '../assets/Images/ConstructionWork.jpg';
import maintenance from '../assets/Images/maintanance.jpg';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <>
      <Header />
      
      {/* Landing Page */}
      <div id="home" className="relative h-screen">
        <Carousel 
          showThumbs={false} 
          showStatus={false} 
          infiniteLoop 
          autoPlay 
          interval={5000}
          className="h-full"
        >
          <div className="h-screen bg-cover bg-center" style={{ backgroundImage: `url(${construction})` }}></div>
          <div className="h-screen bg-cover bg-center" style={{ backgroundImage: `url(${Carpenter})` }}></div>
          <div className="h-screen bg-cover bg-center" style={{ backgroundImage: `url(${electric})` }}></div>
        </Carousel>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-gray-900 flex flex-col justify-center items-center p-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white">
            Crafting Your Building Solution <span className="text-teal-400">One Click Away</span>
          </h1>
          <h2 className="text-lg md:text-2xl text-white mt-4">
            Where your project needs meet skilled hands and reliable workers
          </h2>
          <Link to={'/workers'}>
            <Button
              style={{ fontSize: '14.4px', backgroundColor: '#008080', color: 'white', fontWeight: 'bold' }}
              className="bg-teal-500 hover:bg-teal-600 mt-6"
              variant="contained"
              endIcon={<ForwardIcon className="hover:scale-x-125" style={{ fontSize: '30px' }} />}
            >
              Discover Available Talent
            </Button>
          </Link>
        </div>
      </div>

      {/* About */}
      <div id="about" className="bg-gray-900 py-12 mt-10">
        <h2 className="text-center text-4xl font-bold text-white mb-8">About Us</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl">
            <BuildIcon style={{ fontSize: '64px', color: '#008080' }} />
            <h3 className="text-2xl font-bold text-gray-800 mt-4">Professional Services</h3>
            <p className="text-gray-600 text-center mt-2">
              Connecting you with skilled electricians, plumbers, painters, carpenters, and construction companies for comprehensive building works.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl">
            <PeopleIcon style={{ fontSize: '64px', color: '#008080' }} />
            <h3 className="text-2xl font-bold text-gray-800 mt-4">Easy Navigation</h3>
            <p className="text-gray-600 text-center mt-2">
              Our user-friendly interface allows you to find and contact professionals in your city with ease.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl">
            <VerifiedUserIcon style={{ fontSize: '64px', color: '#008080' }} />
            <h3 className="text-2xl font-bold text-gray-800 mt-4">Reliable Connections</h3>
            <p className="text-gray-600 text-center mt-2">
              Seamless communication with workers and companies via integrated call and chat features.
            </p>
          </div>
        </div>
      </div>

      {/* Services */}
      <div id="services" className="bg-gray-100 py-12 mt-10">
        <h2 className="text-center text-4xl font-bold text-gray-800 mb-8">Our Services</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
            <img src={maintenance} className="w-full h-48 object-cover transition-transform transform hover:scale-110" alt="Maintenance Services" />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800">Maintenance Services</h3>
              <p className="mt-4 text-gray-600">
                Comprehensive upkeep and management of structures to ensure safety and functionality. Services include routine inspections, repairs, and cleaning.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
            <img src={ConstructionWork} className="w-full h-48 object-cover transition-transform transform hover:scale-110" alt="Construction Services" />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800">Construction Services</h3>
              <p className="mt-4 text-gray-600">
                Expert construction services including building, renovation, and project management, ensuring quality and compliance with standards.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
            <img src={electric} className="w-full h-48 object-cover transition-transform transform hover:scale-110" alt="Electrical Services" />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800">Electrical Services</h3>
              <p className="mt-4 text-gray-600">
                Professional electrical installation, repair, and maintenance services for residential, commercial, and industrial properties.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
     

      <Footer />
    </>
  );
};

export default Home;
