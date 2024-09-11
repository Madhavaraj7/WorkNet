import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import PersonIcon from '@mui/icons-material/Person';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ReviewsIcon from '@mui/icons-material/Reviews';
import BookingsIcon from '@mui/icons-material/Event';
import { getAllCountsAPI, getDailyRevenueAPI } from '../../Services/allAPI'; // Updated import

// Types
interface AllCounts {
  usersCount: number;
  workersCount: number;
  reviewsCount: number;
  bookingsCount: number;
}

interface DailyRevenue {
  day: number;
  revenue: number;
}

const AdHome: React.FC = () => {
  const [allCounts, setAllCounts] = useState<AllCounts | null>(null);
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);

  // Get the auth token
  const token = localStorage.getItem('adtoken') || '';
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // Data for the bar chart comparing Users and Workers
  const userWorkerData = [
    { name: 'Users', count: allCounts?.usersCount || 0 },
    { name: 'Workers', count: allCounts?.workersCount || 0 },
  ];

  // Helper function to format day as string (e.g., 1, 2, 3)
  const formatDay = (day: number): string => {
    return day < 10 ? `0${day}` : `${day}`;
  };

  // Fetch counts and daily revenue data from API
  const getAllCountsAndRevenue = async () => {
    try {
      // Fetch counts (users, workers, reviews, bookings)
      const countsResult = await getAllCountsAPI(token);
      console.log('Counts Data:', countsResult);

      // Fetch daily revenue
      const today = now.getDate();
      const revenueResult = await getDailyRevenueAPI(year, month, today, token);
      console.log('Daily Revenue Data:', revenueResult);

      // Set data into state
      if (countsResult) setAllCounts(countsResult);
      if (revenueResult) {
        const formattedRevenueData = revenueResult.map((item: { day: number; revenue: number; }) => ({
          day: formatDay(item.day),
          revenue: item.revenue
        }));
        setDailyRevenue(formattedRevenueData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // UseEffect hook to fetch data on component mount
  useEffect(() => {
    getAllCountsAndRevenue();
  }, [token, year, month]);

  return (
    <Box component="main" sx={{ flexGrow: 1, paddingLeft: 10, paddingTop: 8 }}>
      {/* Counts Cards Section */}
      <div className="flex justify-between w-full px-8 gap-10">
        {/* Users Card */}
        <div style={{ background: '#0088FE' }} className="w-64 h-48 rounded-lg shadow-lg hover:shadow-2xl transition-shadow flex flex-col justify-between">
          <div className="flex w-full justify-between h-36 items-center px-4">
            <h4 className="text-2xl text-white font-bold">{allCounts?.usersCount || 0} <br /> Users</h4>
            <PersonIcon style={{ fontSize: '50px' }} className="text-white" />
          </div>
          <Link to={'/adusers'} className="block w-full">
            <div className="show-items h-12 flex items-center justify-center rounded-b-lg bg-white hover:bg-gray-200 transition-all">
              <h6 className="text-center text-lg text-gray-700">Show Users</h6>
            </div>
          </Link>
        </div>

        {/* Workers Card */}
        <div style={{ background: '#00C49F' }} className="w-64 h-48 rounded-lg shadow-lg hover:shadow-2xl transition-shadow flex flex-col justify-between">
          <div className="flex w-full justify-between h-36 items-center px-4">
            <h4 className="text-2xl text-white font-bold">{allCounts?.workersCount || 0} <br /> Workers</h4>
            <EngineeringIcon style={{ fontSize: '50px' }} className="text-white" />
          </div>
          <Link to={'/adworkers'} className="block w-full">
            <div className="show-items h-12 flex items-center justify-center rounded-b-lg bg-white hover:bg-gray-200 transition-all">
              <h6 className="text-center text-lg text-gray-700">Show Workers</h6>
            </div>
          </Link>
        </div>

        {/* Reviews Card */}
        <div style={{ background: '#FFBB28' }} className="w-64 h-48 rounded-lg shadow-lg hover:shadow-2xl transition-shadow flex flex-col justify-between">
          <div className="flex w-full justify-between h-36 items-center px-4">
            <h4 className="text-2xl text-white font-bold">{allCounts?.reviewCount || 0} <br /> Reviews</h4>
            <ReviewsIcon style={{ fontSize: '50px' }} className="text-white" />
          </div>
          <Link to={'/adReviews'} className="block w-full">
            <div className="show-items h-12 flex items-center justify-center rounded-b-lg bg-white hover:bg-gray-200 transition-all">
              <h6 className="text-center text-lg text-gray-700">Show Reviews</h6>
            </div>
          </Link>
        </div>

        {/* Bookings Card */}
        <div style={{ background: '#FF8042' }} className="w-64 h-48 rounded-lg shadow-lg hover:shadow-2xl transition-shadow flex flex-col justify-between">
          <div className="flex w-full justify-between h-36 items-center px-4">
            <h4 className="text-2xl text-white font-bold">{allCounts?.bookingsCount || 0} <br /> Bookings</h4>
            <BookingsIcon style={{ fontSize: '50px' }} className="text-white" />
          </div>
          <Link to={'/adrevenue'} className="block w-full">
            <div className="show-items h-12 flex items-center justify-center rounded-b-lg bg-white hover:bg-gray-200 transition-all">
              <h6 className="text-center text-lg text-gray-700">Show Bookings</h6>
            </div>
          </Link>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-10 px-8">
        {/* User & Worker Comparison Chart */}
        <h3 className="text-center text-2xl font-bold mb-5">User & Worker Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userWorkerData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>


        {/* Daily Revenue Section */}
        {/* <h3 className="text-center text-2xl font-bold mb-5 mt-10">Daily Revenue</h3>
        {dailyRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-lg">No revenue data available for today.</p>
        )} */}
      </div>
    </Box>
  );
};

export default AdHome;
