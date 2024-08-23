import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getAdminAllworkersAPI, updateStatusAPI } from "../../Services/allAPI";
import { toast } from "react-toastify";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface Worker {
  _id: string;
  registerImage: string;
  name: string;
  phoneNumber: string;
  categories: string;
  userId: string;
  workImages: string[];
  createdAt: string;
  status: string;
}

const WorkerApprov: React.FC = () => {
  const [allworkers, setAllWorkers] = useState<Worker[]>([]);
  const [pendingWorkerResp, setPendingWorkerResp] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>("pending");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const token = localStorage.getItem("adtoken");

  const getAllWorkers = async () => {
    if (token) {
      const result = await getAdminAllworkersAPI(token);
      console.log("lllll", result);

      if (result.length) {
        setAllWorkers(result);
      } else {
        console.log(result);
      }
    } else {
      console.log("Token not found");
    }
  };

  const handleChange = async (event: any, index: number, id: string) => {
    const { value } = event.target;
    const updatedWorkers = [...allworkers];
    updatedWorkers[index].status = value;

    if (token) {
      try {
        const result = await updateStatusAPI(id, value, token);

        console.log("API result:", result);

        if (result.userId) {
          toast.success(`Status changed to ${value}`);
          setAllWorkers(updatedWorkers);
        } else {
          toast.error("Failed to change status. Please try again.");
          console.log("Update result:", result);
        }
      } catch (error) {
        toast.error("An error occurred while changing status.");
        console.error("Error updating status:", error);
      }
    } else {
      toast.error("Token not found. Please log in again.");
      console.log("Token not found");
    }
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
  };

  const handleImageClick = (images: string[], index: number) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setOpenModal(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? currentImages.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    getAllWorkers();
  }, []);

  useEffect(() => {
    if (allworkers) {
      setPendingWorkerResp(
        allworkers.filter((worker) => worker.status === sortValue).length > 0
      );
    }
  }, [allworkers, sortValue]);

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
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-700">Admin Approval</h1>
        <Box sx={{ minWidth: 120 }}>
          <FormControl
            size="small"
            sx={{
              bgcolor: "yellow.300",
              fontWeight: "bold",
              borderRadius: 1,
              width: "8rem",
            }}
          >
            <InputLabel id="sort-select-label">Sort</InputLabel>
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={sortValue}
              label="Sort"
              onChange={(e) => handleSortChange(e.target.value as string)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="pending">
                <PauseCircleOutlineIcon color="info" />
                &nbsp;Pending
              </MenuItem>
              <MenuItem value="approved">
                <CheckCircleOutlineIcon color="success" />
                &nbsp;Approved
              </MenuItem>
              <MenuItem value="rejected">
                <BlockIcon fontSize="small" color="error" />
                &nbsp;rejected
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
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
                "Register Image",
                "Name",
                "Phone",
                "Categories",
                "Work Images",
                "Created At",
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
            {allworkers
              ?.filter((worker) =>
                sortValue === "" ? worker : worker.status === sortValue
              )
              .map((worker, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-100"
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    className="text-center"
                    sx={{ fontSize: "16px", padding: "12px" }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center">
                    <img
                      className="border-2 mx-auto transition-transform duration-300 transform hover:scale-110"
                      width={60}
                      height={60}
                      src={worker.registerImage}
                      alt="Worker"
                      style={{ borderRadius: "8px", objectFit: "cover" }}
                    />
                  </TableCell>
                  <TableCell
                    className="text-center"
                    sx={{ fontSize: "16px", padding: "12px" }}
                  >
                    {worker.name}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    sx={{ fontSize: "16px", padding: "12px" }}
                  >
                    {worker.phoneNumber}
                  </TableCell>
                  <TableCell
                  className="text-center"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  {Array.isArray(worker.categories)
                    ? worker.categories
                        .map((category) => category.name)
                        .join(", ")
                    : "No categories"}
                </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="px-6 py-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105 font-semibold"
                        onClick={() =>
                          handleImageClick(worker.workImages, index)
                        }
                      >
                        View Images
                      </button>
                    </div>
                  </TableCell>

                  <TableCell
                    className="text-center"
                    sx={{ fontSize: "16px", padding: "12px" }}
                  >
                    {worker.createdAt.split("T")[0]}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    sx={{ fontSize: "16px", padding: "12px" }}
                  >
                    <FormControl
                      size="small"
                      sx={{ minWidth: 120 }}
                      className="font-bold rounded-md"
                    >
                      <Select
                        value={worker.status}
                        onChange={(event) =>
                          handleChange(event, index, worker._id)
                        }
                      >
                        <MenuItem value="pending">
                          <PauseCircleOutlineIcon color="info" />
                          &nbsp;Pending
                        </MenuItem>
                        <MenuItem value="approved">
                          <CheckCircleOutlineIcon color="success" />
                          &nbsp;Approved
                        </MenuItem>
                        <MenuItem value="rejected">
                          <BlockIcon color="error" />
                          &nbsp;rejected
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            {!pendingWorkerResp && (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                  <p
                    style={{
                      color: "#F56565", // Tailwind's text-red-500 color
                      fontSize: "18px",
                      fontWeight: "bold",
                      padding: "16px 0",
                    }}
                  >
                    No workers found for the selected status.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '600px', // Fixed width
          height: '400px', // Fixed height
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <img
          src={currentImages[currentImageIndex]}
          alt="Worker Work"
          style={{
            width: '100%', // Scale image to fit within fixed dimensions
            height: '100%',
            objectFit: 'contain', // Ensure the image maintains its aspect ratio
          }}
        />
        <IconButton
          onClick={handlePrevImage}
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            borderRadius: '50%',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          }}
          aria-label="Previous Image"
        >
          <ArrowBackIosNewIcon fontSize="large" />
        </IconButton>
        <IconButton
          onClick={handleNextImage}
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            borderRadius: '50%',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          }}
          aria-label="Next Image"
        >
          <ArrowForwardIosIcon fontSize="large" />
        </IconButton>
        <IconButton
          onClick={() => setOpenModal(false)}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            borderRadius: '50%',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          }}
          aria-label="Close Modal"
        >
          <span aria-hidden="true" style={{ fontSize: '24px', fontWeight: 'bold' }}>&times;</span>
        </IconButton>
      </Box>
    </Modal>
    </Box>
  );
};

export default WorkerApprov;
