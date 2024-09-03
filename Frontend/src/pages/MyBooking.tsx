import React, { useEffect, useState } from "react";
import { getUserBookedWorkersAPI } from "../Services/allAPI";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaWhatsapp, FaPhone } from "react-icons/fa";
import { Pagination, Stack } from "@mui/material";

interface Worker {
  _id: string;
  name: string;
  phoneNumber: string;
  whatsappNumber: string;
  registerImage: string;
}

interface Booking {
  workerId: Worker | null;
  amount: number;
  status: string;
  createdAt: string;
}

const MyBooking: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [bookingsPerPage] = useState(5);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found");
        return;
      }

      try {
        const response = await getUserBookedWorkersAPI(token);
        setBookings(response.data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching bookings:", error);
          setError(error.message);
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchBookings();
  }, []);

  // Pagination logic
  const indexOfLastBooking = page * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <br />
      <br />
      <div className="flex-grow p-8">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-teal-800">
          My Bookings
        </h2>
        {error ? (
          <p className="text-red-600 text-center text-lg mb-8">{`Error: ${error}`}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <thead>
                  <tr className="bg-teal-700 text-white">
                    <th className="py-4 px-6 border-b">Profile</th>
                    <th className="py-4 px-6 border-b">Name</th>
                    <th className="py-4 px-6 border-b">Amount</th>
                    <th className="py-4 px-6 border-b">Status</th>
                    <th className="py-4 px-6 border-b">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.length > 0 ? (
                    currentBookings.map((booking, index) => {
                      const worker = booking.workerId;

                      return (
                        <tr
                          key={index}
                          className={`text-center border-b ${
                            index % 2 === 0 ? "bg-gray-100" : "bg-white"
                          } hover:bg-gray-200 transition-colors`}
                        >
                          <td className="py-4 px-6 border-b">
                            {worker?.registerImage ? (
                              <img
                                src={worker.registerImage}
                                alt={worker.name}
                                className="w-20 h-20 object-cover rounded-full mx-auto shadow-md"
                              />
                            ) : (
                              <span className="text-gray-500">No Image</span>
                            )}
                          </td>
                          <td className="py-4 px-6 border-b font-semibold text-gray-800">
                            {worker ? worker.name : "N/A"}
                          </td>
                          <td className="py-4 px-6 border-b text-gray-900 font-medium">
                          ₹{booking.amount.toFixed(2)}
                          </td>
                          <td className="py-4 px-6 border-b text-gray-700 capitalize">
                            {booking.status}
                          </td>
                          <td className="py-4 px-6 border-b">
                            <div className="flex items-center justify-center space-x-3">
                              {worker?.whatsappNumber && (
                                <button
                                  onClick={() => window.open(`https://wa.me/${worker.whatsappNumber}`, "_blank")}
                                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-md transition-transform duration-300 transform hover:scale-105"
                                >
                                  <FaWhatsapp className="mr-2 text-lg" />
                                  <span className="text-sm">WhatsApp</span>
                                </button>
                              )}
                              {worker?.phoneNumber && (
                                <a
                                  href={`tel:${worker.phoneNumber}`}
                                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-md transition-transform duration-300 transform hover:scale-105"
                                >
                                  <FaPhone className="mr-2 text-lg" />
                                  <span className="text-sm">Call</span>
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 px-4 text-center text-gray-500"
                      >
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <Stack spacing={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_event, value) => setPage(value)}
                  color="primary"
                  siblingCount={1}
                  boundaryCount={1}
                />
              </Stack>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyBooking;
