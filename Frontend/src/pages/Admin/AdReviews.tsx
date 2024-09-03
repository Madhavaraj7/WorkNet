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
  Avatar,
  TextField,
  IconButton,
  Typography,
  Stack,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { getAllReviewsWithDetailsAPI } from "../../Services/allAPI";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface Review {
  profileImage: string | undefined;
  username: string | undefined;
  workerId: {
    _id: string;
    name: string;
  };
  userId: {
    _id: string;
    username: string;
    profileImage: string;
  };
  ratingPoints: number;
  feedback: string;
  createdAt: string;
}

const AdReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [reviewsPerPage] = useState<number>(5);

  const token = localStorage.getItem("adtoken");

  const getAllReviews = async () => {
    if (token) {
      try {
        const result = await getAllReviewsWithDetailsAPI(token);
        if (result.length) {
          setReviews(result);
        } else {
          console.log(result);
        }
      } catch (error) {
        setError("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Token not found");
    }
  };

  useEffect(() => {
    getAllReviews();
  }, []);

  const indexOfLastReview = page * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const filteredReviews = currentReviews.filter(
    (review) =>
      review.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.feedback.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-700">Reviews Management</h1>
        <TextField
          label="Search Reviews"
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
                "Worker Name",
                "User Profile",
                "Username",
                "Rating",
                "Feedback",
                "Created At",
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
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review, index) => (
                <TableRow
                  key={review.userId._id}
                  className="hover:bg-gray-100"
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    className="text-center"
                    sx={{ fontSize: "16px", padding: "12px" }}
                  >
                    {indexOfFirstReview + index + 1}
                  </TableCell>
                  <TableCell className="text-center">
                    <Avatar
                      src={review.userId.profileImage}
                      alt={review.username}
                      sx={{ width: 50, height: 50, margin: "auto" }}
                    />
                  </TableCell>
                  <TableCell
                    className="text-center"
                    sx={{ fontSize: "16px", padding: "12px" }}
                  >
                    {review.userId.username}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    sx={{ fontSize: "16px", padding: "12px" }}
                  >
                    {review.workerId.name}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    sx={{ fontSize: "16px", padding: "12px" }}
                  >
                    {review.ratingPoints}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    sx={{ fontSize: "16px", padding: "12px" }}
                  >
                    {review.feedback}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    sx={{ fontSize: "16px", padding: "12px" }}
                  >
                    {new Date(review.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No reviews found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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
    </Box>
  );
};

export default AdReviews;
