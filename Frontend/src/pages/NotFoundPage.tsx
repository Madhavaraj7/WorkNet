// src/pages/NotFoundPage.tsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 text-center">
        <div className="relative flex flex-col items-center justify-center w-full max-w-lg p-8 bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img
              src="https://source.unsplash.com/1600x900/?nature,water"
              alt="Background"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black opacity-30"></div>
          </div>
          <h1 className="text-8xl font-extrabold text-red-600 mb-4">404</h1>
          <p className="text-2xl font-semibold text-gray-800 mb-6">
            Oops! This page is not available.
          </p>
          <img
            src="https://media.giphy.com/media/3o6ZsYo1W02M4wDDf6/giphy.gif"
            alt="404 Error"
            className="w-full max-w-sm mx-auto mb-6 rounded-lg shadow-lg border-4 border-gray-300"
          />
          <a
            href="/"
            className="inline-block px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-lg shadow-md hover:from-red-600 hover:to-pink-600 transition duration-300 transform hover:scale-105"
          >
            Return to Home
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFoundPage;
