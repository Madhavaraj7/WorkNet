import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getReviewsByWorkerIdAPI } from "../Services/allAPI"; 
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Rating,
  Paper,
  Pagination,
  CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

interface Review {
  userId: {
    _id: string;
    username: string;
    profileImage: string;
  };
  feedback: string;
  ratingPoints: number;
  createdAt: string;
  updatedAt: string;
  _id: string;
  workerId: string;
}

const WorkerReviews: React.FC = () => {
  const { wId } = useParams<{ wId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const reviewsPerPage = 3;
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (wId && token) {
          const response = await getReviewsByWorkerIdAPI(wId, token);
          setReviews(response || []);
          setTotalPages(Math.ceil((response?.length || 0) / reviewsPerPage));
        }
      } catch (err) {
        setError("Failed to fetch reviews");
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [wId, token]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const paginatedReviews = reviews.slice(startIndex, endIndex);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
        Reviews
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
        {reviews.length === 0 ? (
          <Box textAlign="center" py={3}>
            <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
              No reviews yet
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Be the first to leave a review and share your experience!
            </Typography>
          </Box>
        ) : (
          <>
            <List>
              {paginatedReviews.map((review) => (
                <React.Fragment key={review._id}>
                  <ListItem>
                    <Avatar
                      src={review.userId.profileImage}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {review.userId.username}
                          </Typography>
                          <Rating
                            name="read-only"
                            value={review.ratingPoints}
                            readOnly
                            size="small"
                            sx={{ mt: 1, color: "#fbc02d" }}
                            icon={<StarIcon />}
                            emptyIcon={<StarIcon sx={{ color: "#e0e0e0" }} />}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography sx={{ mt: 1 }}>
                          {review.feedback}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
            <Box
              display="flex"
              justifyContent="center"
              sx={{ mt: 2 }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "8px",
                    mx: 0.5,
                  },
                }}
              />
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default WorkerReviews;
