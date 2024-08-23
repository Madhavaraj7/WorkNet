import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Rating,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAWorkerAPI } from "../Services/allAPI";
import { SERVER_URL } from "../Services/serverURL";
import LeftArrow from "../assets/Images/LeftArrow.png";
import RightArrow from "../assets/Images/RightArrow.png";
import { useParams } from "react-router-dom";

// Photos Component
function Photos({ workImages }: { workImages: string[] }) {
  const SlickArrowLeft = (props: any) => (
    <img id="Arrows" src={LeftArrow} alt="Previous" {...props} />
  );

  const SlickArrowRight = (props: any) => (
    <img id="Arrows" src={RightArrow} alt="Next" {...props} />
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

  // Filter out duplicate URLs
  const uniqueWorkImages = Array.from(new Set(workImages));

  return (
    <Box className="mt-5">
      <Typography variant="h4" className="font-bold mb-4">
        Photos
      </Typography>
      {uniqueWorkImages.length > 0 ? (
        <Box className="px-7 max-sm:px-0 mt-10">
          <Slider {...settings}>
            {uniqueWorkImages.map((url, index) => (
              <Box key={index} className="p-2">
                <Box
                  className="rounded-lg h-72 w-72 bg-cover bg-center"
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

// Reviews Component
function Reviews() {
  const dummyReviews = [
    {
      name: "Alice Johnson",
      rating: 5,
      comment:
        "Fantastic work! Highly recommend this worker for their professionalism and skill.",
      date: "August 10, 2024",
    },
    {
      name: "Bob Smith",
      rating: 4,
      comment:
        "Great service and attention to detail. A few delays but overall satisfied.",
      date: "August 5, 2024",
    },
    {
      name: "Clara Davis",
      rating: 4,
      comment:
        "Very good experience. Would love to work with this worker again in the future.",
      date: "August 1, 2024",
    },
  ];

  return (
    <Box className="mt-10">
      <Typography variant="h6" className="font-semibold text-gray-700">
        Reviews
      </Typography>
      <Stack spacing={4} mt={4}>
        {dummyReviews.map((review, index) => (
          <Card key={index} variant="outlined" className="shadow-lg">
            <CardContent>
              <Typography variant="h6" className="font-bold">
                {review.name}
              </Typography>
              <Rating
                name="read-only"
                value={review.rating}
                readOnly
                className="mt-2"
              />
              <Typography variant="body2" className="mt-2 text-gray-600">
                {review.comment}
              </Typography>
              <Typography variant="caption" className="mt-1 text-gray-500">
                {review.date}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

function Worker() {
  const { wId } = useParams<{ wId: string }>();
  const [workerDetails, setWorkerDetails] = useState<any>(null);

  const getAWorker = async () => {
    try {
      const result = await getAWorkerAPI(wId);
      console.log("hello",result);
      
      if (result) {
        setWorkerDetails(result);
      } else {
        console.error(result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAWorker();
  }, [wId]);

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
                <Typography variant="body2" className="text-gray-600 mt-1">
                  Phone: {workerDetails.phoneNumber}
                </Typography>
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
                    onClick={() => alert("Added to slots")}
                  >
                    Add to Slot
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
            <Reviews />
          </Box>
        )}
      </Box>
      <Footer />
    </>
  );
}

export default Worker;
