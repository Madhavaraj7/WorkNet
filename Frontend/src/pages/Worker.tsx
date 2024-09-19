import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Rating,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  getAWorkerAPI,
  getSlotsByWorkerIdAPI,
  postReviewAPI,
  bookWorkerWithWalletAPI,
  getWalletBalanceAPI,
} from "../Services/allAPI";
import { SERVER_URL } from "../Services/serverURL";
import LeftArrow from "../assets/Images/LeftArrow.png";
import RightArrow from "../assets/Images/RightArrow.png";
import { useNavigate, useParams } from "react-router-dom";
import { KeyboardBackspace } from "@mui/icons-material";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import WorkerReviews from "../pages/Review";
import StarIcon from "@mui/icons-material/Star";

// Photos Component
function Photos({ workImages }: { workImages: string[] }) {
  const SlickArrowLeft = (props: any) => (
    <img
      id="Arrows"
      src={LeftArrow}
      alt="Previous"
      {...props}
      className="slick-arrow slick-prev"
    />
  );

  const SlickArrowRight = (props: any) => (
    <img
      id="Arrows"
      src={RightArrow}
      alt="Next"
      {...props}
      className="slick-arrow slick-next"
    />
  );

  const settings = {
    infinite: true,
    centerPadding: "60px",
    centerMode: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const uniqueWorkImages = Array.from(new Set(workImages));

  return (
    <Box className="mt-5">
      <Typography
        variant="h4"
        className="font-bold mb-4 text-center text-gray-800 tracking-wide"
      >
        Our Work
      </Typography>
      {uniqueWorkImages.length > 0 ? (
        <Box className="px-7 max-sm:px-0 mt-10">
          <Slider {...settings}>
            {uniqueWorkImages.map((url, index) => (
              <Box
                key={index}
                className="p-2 rounded-lg overflow-hidden transition-transform transform hover:scale-105"
              >
                <Box
                  className="rounded-lg h-72 w-72 bg-cover bg-center shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out"
                  style={{ backgroundImage: `url(${url})` }}
                />
              </Box>
            ))}
          </Slider>
        </Box>
      ) : (
        <Typography className="text-center text-gray-500 mt-6">
          No photos available
        </Typography>
      )}
    </Box>
  );
}

const stripePromise = loadStripe(
  "pk_test_51MWBZUSFYLZi23L4T1FEBPHNGRC5u1uSzsXntd6iwtKOQcTBRJMoARdSSAAqQswE55vrKvH5eWMrBCuO4ad0ZaLV00jgftxjNw"
);

function Worker() {
  const { wId } = useParams<{ wId: string }>();
  const [workerDetails, setWorkerDetails] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  const token = localStorage.getItem("token") || "";

  const handleOpenReviewModal = () => {
    setOpenReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
    setReviewText("");
    setRating(null);
  };

  const handleSubmitReview = async () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        throw new Error("User not found in local storage.");
      }

      const user = JSON.parse(userString);
      if (!user || typeof user !== "object") {
        throw new Error("Invalid user data in local storage.");
      }

      const userId = user._id;
      const userName = user.profileImage;
      const userPhoto = user.photo;
      const workerId = wId;

      const ratingPoints = rating;
      const feedback = reviewText;

      const reviewData = {
        workerId,
        userId,
        ratingPoints,
        feedback,
        userName,
        userPhoto,
      };

      const response = await postReviewAPI(reviewData, token);

      if (response && response.error) {
        throw new Error(response.error);
      }

      toast.success("Review posted successfully!");
      handleCloseReviewModal();
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while posting the review."
      );
    }
  };

  const getAWorker = async () => {
    try {
      const result = await getAWorkerAPI(wId);
      console.log("hello", result);

      if (result) {
        setWorkerDetails(result);
      } else {
        console.error(result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = async () => {
    if (!token) {
      toast.warn("Please Login First.");
      return;
    }

    if (wId) {
      try {
        const slots = await getSlotsByWorkerIdAPI(wId, token);
        setAvailableSlots(slots);
        setOpenModal(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Worker ID is undefined");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    setOpenModal(false);
    setOpenPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
  };

  const formatDate = (dateString: string | number | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-GB", options).format(
      new Date(dateString)
    );
  };
  const navigate = useNavigate();

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !workerDetails) {
      toast.error("Please select a slot and worker details.");
      return;
    }

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    console.log("User data:", user);

    if (!user || !user.email || !user.username) {
      console.error("User email or username is missing from local storage");
      alert("User email or username is missing. Please log in again.");
      return;
    }

    console.log("Selected Slot ID:", selectedSlot._id);

    try {
      const response = await fetch(`${SERVER_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workerId: wId,
          slotId: selectedSlot._id,
          amount: workerDetails.amount,
          customerEmail: user.email,
          customerName: user.username,
          customerAddress: workerDetails.address,
        }),
      });

      const responseBody = await response.text();

      console.log("Response Status:", response.status);
      console.log("Response Body:", responseBody);

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${responseBody}`
        );
      }

      const sessionData = JSON.parse(responseBody);

      console.log("Session Data:", sessionData);
      localStorage.setItem("sessionData", JSON.stringify(sessionData));

      if (!sessionData.sessionId) {
        throw new Error("Session ID is missing from response");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe.js failed to load");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionData.sessionId,
      });

      if (error) {
        console.error("Stripe Checkout error:", error);
        toast.error("An error occurred during payment processing.");
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error.message);
      toast.error(
        "An error occurred while creating the booking. Please try again."
      );
    }
  };

  useEffect(() => {
    getAWorker();
  }, [wId]);

  <Rating
    name="worker-rating"
    value={rating}
    onChange={(_event, newValue) => setRating(newValue)}
    size="large"
    emptyIcon={<StarIcon fontSize="inherit" />}
  />;

  const handleWalletBooking = async () => {
    if (!selectedSlot || !workerDetails) {
      toast.error("Please select a slot and worker details.");
      return;
    }

    try {
      const userWallet = await getWalletBalanceAPI(token);

      if (userWallet.walletBalance < workerDetails.amount) {
        toast.error("Insufficient wallet balance.");
        return;
      }

      const reqBody = {
        workerId: wId,
        slotId: selectedSlot._id,
        amount: workerDetails.amount,
      };

      const response = await bookWorkerWithWalletAPI(reqBody, token);
      console.log(response);

      toast.success("Worker booked successfully using wallet.");
      navigate("/payment-success");
    } catch (error: any) {
      console.error("Error booking with wallet:", error.message);
      toast.error(
        "An error occurred while booking with your wallet. Please try again."
      );
    }
  };

  return (
    <>
      <Header />
      <br />
      <br />
      <Box className="min-h-screen bg-gray-50 px-4 md:px-8 py-8">
        {workerDetails === null ? (
          <Stack spacing={5}>
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Box className="space-y-6">
                <Skeleton variant="rounded" width="100%" height={200} />
                <Skeleton variant="rounded" width="80%" height={30} />
                <Skeleton variant="rounded" width="90%" height={20} />
                <Skeleton variant="rounded" width="70%" height={20} />
                <Skeleton variant="rounded" width="80%" height={20} />
              </Box>
              <Box className="flex items-center justify-center">
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={300}
                />
              </Box>
            </Box>
            <Stack spacing={5} className="mt-8">
              <Skeleton variant="rounded" width="80%" height={30} />
              <Box className="space-x-3 flex justify-between">
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={200}
                />
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={200}
                />
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={200}
                />
              </Box>
            </Stack>
          </Stack>
        ) : (
          <Box className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <Box className="flex flex-col md:flex-row md:items-start">
              <img
                src={workerDetails.registerImage}
                alt={workerDetails.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow-md"
              />
              <Box className="text-center md:text-left md:ml-6 mt-4 md:mt-0">
                <Typography variant="h4" className="font-bold text-gray-800">
                  {workerDetails.name}
                </Typography>
                <Typography
                  variant="body1"
                  className="mt-2 text-gray-600 flex items-center justify-center md:justify-start"
                >
                  <LocationOnIcon
                    fontSize="small"
                    className="mr-1 text-gray-500"
                  />
                  {workerDetails.address}, {workerDetails.city},{" "}
                  {workerDetails.state}
                </Typography>
                {/* <Typography variant="body2" className="text-gray-600 mt-1">
                  Phone: {workerDetails.phoneNumber}
                </Typography> */}
                <Typography variant="body2" className="text-gray-600">
                  Available: {workerDetails.workingDays},{" "}
                  {workerDetails.availableTime}
                </Typography>
                <Box className="flex items-center justify-center md:justify-start mt-2">
                  <Rating
                    name="read-only"
                    value={workerDetails.experience}
                    readOnly
                  />
                </Box>
                <Box className="flex gap-2 mt-4 justify-center md:justify-start">
                  <Button
                    variant="contained"
                    color="primary"
                    className="mt-4"
                    onClick={handleOpenModal}
                  >
                    Add to Booking
                  </Button>
                </Box>
              </Box>
            </Box>
            <br />
            <Divider className="my-4" />
            <Box>
              <Typography variant="h6" className="font-semibold text-gray-700">
                Overview
              </Typography>
              <Typography className="mt-2 text-gray-600">
                {workerDetails.overview}
              </Typography>
              <Box className="mt-4">
                <Typography
                  variant="body1"
                  className="font-semibold text-gray-700"
                >
                  Services:
                </Typography>
                <Typography className="text-gray-600">
                  {Array.isArray(workerDetails.categories)
                    ? workerDetails.categories
                        .map((category: { name: any }) =>
                          typeof category === "string"
                            ? category
                            : category.name
                        )
                        .join(", ")
                    : "No services listed"}
                </Typography>{" "}
              </Box>
              <Box className="mt-4">
                <Typography
                  variant="body1"
                  className="font-semibold text-gray-700"
                >
                  Experience:
                </Typography>
                <Typography className="text-gray-600">
                  {workerDetails.experience} years
                </Typography>
              </Box>
              <Box className="mt-4">
                <Typography
                  variant="body1"
                  className="font-semibold text-gray-700"
                >
                  Availability:
                </Typography>
                <Typography className="text-gray-600">
                  {workerDetails.availableTime}
                </Typography>
              </Box>
            </Box>
            <Photos workImages={workerDetails.workImages || []} />
          </Box>
        )}
        {/* Modal for Available Slots */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            style: {
              borderRadius: "16px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <DialogTitle className="bg-yellow-500 text-white text-lg font-semibold rounded-t-lg">
            Available Slots
          </DialogTitle>
          <br />
          <DialogContent className="bg-gray-50 p-6">
            {availableSlots.length > 0 ? (
              <Stack spacing={2}>
                {availableSlots.map((slot, index) => (
                  <Box
                    key={index}
                    className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-yellow-100 transition ease-in-out duration-200"
                    onClick={() => handleSlotSelect(slot)}
                  >
                    <Typography
                      variant="h6"
                      className="font-bold text-yellow-800"
                    >
                      Date: {formatDate(slot.date)}
                    </Typography>
                    <Typography variant="body1" className="text-gray-700">
                      Time: {workerDetails.availableTime}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body1" className="text-center text-gray-600">
                No slots available
              </Typography>
            )}
          </DialogContent>
          <DialogActions className="bg-gray-100 p-4 rounded-b-lg">
            <Button
              onClick={handleCloseModal}
              color="primary"
              variant="outlined"
              className="text-yellow-600 border-yellow-600 hover:bg-yellow-600 hover:text-white"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment Details Modal */}
        <Dialog
          open={openPaymentModal}
          onClose={handleClosePaymentModal}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            style: {
              borderRadius: "16px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <DialogTitle className="bg-teal-500 text-white text-lg font-semibold rounded-t-lg">
            <Box className="flex items-center">
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  handleClosePaymentModal();
                  handleOpenModal();
                }}
                aria-label="back"
                className="mr-2"
              >
                <KeyboardBackspace />
              </IconButton>
              Booking Details
            </Box>
          </DialogTitle>
          <br />
          <DialogContent className="bg-gray-50 p-6">
            {selectedSlot && workerDetails ? (
              <Box>
                <Typography
                  variant="h6"
                  className="font-bold text-gray-800 mb-4"
                >
                  Selected Slot
                </Typography>
                <Box className="mb-4 p-4 border border-gray-300 rounded-lg bg-white shadow-md">
                  <Typography variant="body1" className="text-gray-700">
                    <strong>Date:</strong> {formatDate(selectedSlot.date)}
                  </Typography>
                  <Typography variant="body1" className="text-gray-700">
                    <strong>Time:</strong> {workerDetails.availableTime}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  className="font-bold text-gray-800 mb-4"
                >
                  Payment Details
                </Typography>
                <Box className="p-4 border border-gray-300 rounded-lg bg-white shadow-md">
                  <Typography variant="body1" className="text-gray-700">
                    <strong>Advance Amount:</strong> ₹{workerDetails.amount}
                  </Typography>
                  <Typography variant="body1" className="text-gray-700">
                    <strong>Payment Mode:</strong> {workerDetails.paymentMode}
                  </Typography>
                </Box>
                <br />
                <div className="flex gap-x-4">
                  <button
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    onClick={handleConfirmBooking}
                  >
                    Online Payment
                  </button>

                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    onClick={handleWalletBooking}
                  >
                    Book with Wallet
                  </button>
                </div>
              </Box>
            ) : (
              <Typography variant="body1" className="text-center text-gray-600">
                No slot selected
              </Typography>
            )}
          </DialogContent>
          <DialogActions className="bg-gray-100 p-4 rounded-b-lg">
            <Button
              onClick={handleClosePaymentModal}
              color="secondary"
              variant="outlined"
              className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <br />
        {/* Review Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleOpenReviewModal}
          className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          sx={{
            borderRadius: 2,
            padding: "12px 24px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <span className="flex items-center gap-2">
            <StarIcon /> Post a Review
          </span>
        </Button>

        {/* Review Modal */}
        <Dialog
          open={openReviewModal}
          onClose={handleCloseReviewModal}
          aria-labelledby="review-dialog-title"
          maxWidth="sm"
          fullWidth
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "16px",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <DialogContent
            sx={{
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "#fafafa",
              borderRadius: "0 0 16px 16px",
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", fontSize: "1.75rem", mb: 1 }}
            >
              Your Feedback Matters!
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ mb: 2, color: "#333", fontWeight: "bold" }}
            >
              Rate this worker
            </Typography>
            <Rating
              name="worker-rating"
              value={rating}
              onChange={(_event, newValue) => setRating(newValue)}
              size="large"
              icon={<StarIcon sx={{ color: "#fbc02d" }} />}
              emptyIcon={<StarIcon sx={{ color: "#e0e0e0" }} />}
            />
            <Box sx={{ mt: 2, width: "100%" }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, color: "#333", fontWeight: "bold" }}
              >
                Your Review
              </Typography>
              <TextField
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                multiline
                fullWidth
                variant="outlined"
                placeholder="Write your review here..."
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ddd",
                    },
                    "&:hover fieldset": {
                      borderColor: "#bdbdbd",
                    },
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              bgcolor: "#f5f5f5",
              borderTop: "1px solid #ddd",
              padding: "16px",
              borderBottomLeftRadius: "16px",
              borderBottomRightRadius: "16px",
              justifyContent: "center",
            }}
          >
            <Button
              onClick={handleCloseReviewModal}
              color="secondary"
              variant="outlined"
              sx={{
                color: "#f50057",
                borderColor: "#f50057",
                "&:hover": {
                  bgcolor: "#f50057",
                  color: "#fff",
                },
                textTransform: "none",
                borderRadius: "8px",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              color="primary"
              variant="contained"
              sx={{
                bgcolor: "#4caf50",
                "&:hover": {
                  bgcolor: "#388e3c",
                },
                textTransform: "none",
                borderRadius: "8px",
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <WorkerReviews />
      </Box>

      <Footer />
    </>
  );
}

export default Worker;
