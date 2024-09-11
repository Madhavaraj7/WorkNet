import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
  Stack,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getAllBookingsAPI } from "../../Services/allAPI";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Ensure it's imported after jsPDF
import * as XLSX from "xlsx"; // For Excel

// Types
interface Booking {
  _id: string;
  userId: { username: string };
  slotId: { date: string };
  workerId: { name: string }; // Added field for worker's name
  amount: number;
  status: string;
}

const AdRevenue: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [bookingsPerPage] = useState<number>(5);
  const [bookingData, setBookingData] = useState<any[]>([]);
  const token = localStorage.getItem("adtoken");

  const getAllBookings = async () => {
    if (token) {
      try {
        const result = await getAllBookingsAPI(token);
        setBookings(result);

        const bookingsByDate = result.reduce(
          (acc: any, booking: { slotId: { date: string | number | Date } }) => {
            const date = new Date(booking.slotId.date).toLocaleDateString();
            if (!acc[date]) acc[date] = 0;
            acc[date]++;
            return acc;
          },
          {}
        );

        const formattedData = Object.keys(bookingsByDate).map((date) => ({
          date,
          count: bookingsByDate[date],
        }));

        setBookingData(formattedData);
      } catch (error) {
        toast.error("Failed to fetch bookings");
      }
    } else {
      toast.error("Token not found");
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) =>
    booking.userId.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBooking = page * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  // Download PDF function
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Booking Report", 20, 10);
    (doc as any).autoTable({
      head: [["#", "Username", "Date", "Booked Worker", "Amount", "Status"]],
      body: bookings.map((booking, index) => [
        index + 1,
        booking.userId.username,
        new Date(booking.slotId.date).toLocaleDateString(),
        booking.workerId.name,
        `$${booking.amount}`,
        booking.status,
      ]),
    });
    doc.save("booking_report.pdf");
  };

  // Download Excel function
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      bookings.map((booking, index) => ({
        "#": index + 1,
        Username: booking.userId.username,
        Date: new Date(booking.slotId.date).toLocaleDateString(),
        "Booked Worker": booking.workerId.name,
        Amount: `$${booking.amount}`,
        Status: booking.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, "booking_report.xlsx");
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        paddingLeft: { xs: 2, md: 10 },
        paddingTop: { xs: 2, md: 10 },
        paddingRight: { xs: 2, md: 3 },
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-700">Booking Management</h1>
        <TextField
          label="Search by Username"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
          className="w-80 bg-white rounded-md shadow-sm"
        />
      </div>

      <Stack direction="row" spacing={2} className="mb-4">
        <Button variant="contained" color="primary" onClick={downloadPDF}>
          Download PDF
        </Button>
        <Button variant="contained" color="primary" onClick={downloadExcel}>
          Download Excel
        </Button>
      </Stack>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "gray.800" }}>
            <TableRow>
              {[
                "#",
                "Username",
                "Date",
                "Booked Worker",
                "Amount",
                "Status",
              ].map((header) => (
                <TableCell
                  key={header}
                  className="text-white font-semibold text-center"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentBookings.map((booking, index) => (
              <TableRow
                key={booking._id}
                className="hover:bg-gray-100"
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  className="text-center"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  {index + 1 + indexOfFirstBooking}
                </TableCell>
                <TableCell
                  className="text-center"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  {booking.userId.username}
                </TableCell>
                <TableCell
                  className="text-center"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  {new Date(booking.slotId.date).toLocaleDateString()}
                </TableCell>
                <TableCell
                  className="text-center"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  {booking.workerId.name} {/* Worker Name */}
                </TableCell>
                <TableCell
                  className="text-center"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  ${booking.amount}
                </TableCell>
                <TableCell
                  className="text-center"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  {booking.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        spacing={2}
        sx={{ mt: 4 }}
        alignItems="center"
        justifyContent="center"
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_event, value) => setPage(value)}
          color="primary"
          siblingCount={1}
          boundaryCount={1}
        />
      </Stack>

      <Box sx={{ mt: 6 }}>
        <h3 className="text-center text-2xl font-bold mb-5">
          Bookings Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bookingData}>
            {/* Define a gradient for the line */}
            <defs>
              <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Customized Cartesian Grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />

            {/* X and Y Axes with custom styles */}
            <XAxis dataKey="date" tick={{ fontSize: 14, fill: "#333" }} />
            <YAxis tick={{ fontSize: 14, fill: "#333" }} />

            {/* Tooltip customization */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
              }}
              formatter={(value: number) => [
                `${value} bookings`,
                "Total Bookings",
              ]}
            />

            {/* Add the line with gradient, smooth transitions, and dots */}
            <Line
              type="monotone"
              dataKey="count"
              stroke="url(#colorLine)"
              strokeWidth={3}
              dot={{ r: 5, strokeWidth: 2, stroke: "#8884d8", fill: "#fff" }}
              activeDot={{ r: 8 }}
              animationDuration={1000}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default AdRevenue;
