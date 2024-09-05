import React, { useEffect, useState } from "react";
import {
  getUserBookedWorkersAPI,
  getWalletBalanceAPI,
  cancelBookingAPI,
} from "../Services/allAPI";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaWhatsapp, FaPhone } from "react-icons/fa";
import {
  Pagination,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

interface Worker {
  _id: string;
  name: string;
  phoneNumber: string;
  whatsappNumber: string;
  registerImage: string;
}

interface Booking {
  _id: string;
  workerId: Worker | null;
  amount: number;
  status: string;
  createdAt: string;
}

interface WalletTransaction {
  transactionDate: string;
  transactionAmount: number;
  transactionType: "credit" | "debit";
}

const MyBooking: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletTransactions, setWalletTransactions] = useState<
    WalletTransaction[]
  >([]);
  const [page, setPage] = useState(1);
  const [bookingsPerPage] = useState(4);
  const [walletPage, setWalletPage] = useState(1);
  const [walletTransactionsPerPage] = useState(2);

  // State for managing the modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchBookingsAndWalletData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found");
        return;
      }

      try {
        // Fetch bookings
        const bookingsResponse = await getUserBookedWorkersAPI(token);
        setBookings(bookingsResponse.data);

        // Fetch wallet balance and transactions
        const walletResponse = await getWalletBalanceAPI(token);
        console.log(walletResponse);

        setWalletBalance(walletResponse.walletBalance);
        setWalletTransactions(walletResponse.walletTransactions);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching data:", error);
          setError(error.message);
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchBookingsAndWalletData();
  }, []);

  const fetchWalletData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }
  
    try {
      // Fetch updated wallet balance and transactions
      const walletResponse = await getWalletBalanceAPI(token);
      setWalletBalance(walletResponse.walletBalance);
      setWalletTransactions(walletResponse.walletTransactions);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching wallet data:", error);
        setError(error.message);
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred while fetching wallet data.");
      }
    }
  };
  

  const handleOpenModal = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBookingId(null);
  };

  const handleConfirmCancelBooking = async () => {
    if (selectedBookingId) {
      const token = localStorage.getItem("token");
  
      if (!token) {
        setError("No token found");
        return;
      }
  
      try {
        await cancelBookingAPI(selectedBookingId, token);
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== selectedBookingId)
        );
        await fetchWalletData(); // Fetch updated wallet data
        handleCloseModal();
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error canceling booking:", error);
          setError(error.message);
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred while canceling the booking.");
        }
      }
    }
  };
  

  // Pagination logic
  const indexOfLastBooking = page * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const indexOfLastTransaction = walletPage * walletTransactionsPerPage;
  const indexOfFirstTransaction =
    indexOfLastTransaction - walletTransactionsPerPage;
  const currentWalletTransactions = walletTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalWalletPages = Math.ceil(
    walletTransactions.length / walletTransactionsPerPage
  );

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
                    <th className="py-4 px-6 border-b">Action</th>
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
                                  onClick={() =>
                                    window.open(
                                      `https://wa.me/${worker.whatsappNumber}`,
                                      "_blank"
                                    )
                                  }
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
                          <td className="py-4 px-6 border-b">
                            <Button
                              onClick={() => handleOpenModal(booking._id)}
                              variant="contained"
                              color="error"
                            >
                              Cancel
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
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

            <br />


      
            {/* Wallet Balance and Wallet Transactions */}
            <div className="flex mt-8 space-x-4">
              
              {/* Wallet Transactions */}
              <div className="flex-1 p-4 bg-white shadow-lg rounded-lg">
                <h3 className="text-2xl font-extrabold mb-4 text-teal-800">
                  Wallet Transactions
                </h3>
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-teal-700 text-white">
                      <th className="py-4 px-6 border-b">Date</th>
                      <th className="py-4 px-6 border-b">Amount</th>
                      <th className="py-4 px-6 border-b">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentWalletTransactions.length > 0 ? (
                      currentWalletTransactions.map((transaction, index) => (
                        <tr
                          key={index}
                          className={`text-center border-b ${
                            index % 2 === 0 ? "bg-gray-100" : "bg-white"
                          } hover:bg-gray-200 transition-colors`}
                        >
                          <td className="py-4 px-6 border-b text-gray-700">
                            {new Date(
                              transaction.transactionDate
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 border-b text-gray-900">
                            ₹{transaction.transactionAmount.toFixed(2)}
                          </td>
                          <td className="py-4 px-6 border-b text-gray-700 capitalize">
                            {transaction.transactionType}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-8 px-4 text-center text-gray-500"
                        >
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* Pagination for wallet transactions */}
                <div className="flex justify-center mt-8">
                  <Stack spacing={2}>
                    <Pagination
                      count={totalWalletPages}
                      page={walletPage}
                      onChange={(event, value) => setWalletPage(value)}
                      color="primary"
                    />
                  </Stack>
                </div>
              </div>
              {/* Wallet Balance */}
              <div className="flex-2 p-6 bg-gradient-to-r from-teal-400 to-teal-600 shadow-xl rounded-lg border border-teal-500 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <h3 className="text-3xl font-bold mb-4 text-white">
                  Wallet Balance
                </h3>
                <p className="text-2xl font-semibold text-white">
                  ₹
                  {walletBalance !== null
                    ? walletBalance.toFixed(2)
                    : "Loading..."}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
      {/* Cancel Booking Confirmation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this booking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmCancelBooking} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyBooking;
