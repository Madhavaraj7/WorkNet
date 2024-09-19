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
  Modal,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  Pagination,
  Stack,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { getAdminAllworkersAPI, deleteWorkerAPI } from "../../Services/allAPI";
import { toast } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';



interface Worker {
  _id: string;
  registerImage: string;
  name: string;
  phoneNumber: string;
  categories: string;
  userId: string;
  workImages: string[];
  createdAt: string;
  isBlocked: boolean;
  status: string;
  kycDetails: {
    documentType: string;
    documentImage: string;
  }[];
}

const AdWorkers: React.FC = () => {
  const [allWorkers, setAllWorkers] = useState<Worker[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentWorker, setCurrentWorker] = useState<Worker | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentKycImages, setCurrentKycImages] = useState<number>(0);
  const [showKycModal, setShowKycModal] = useState<boolean>(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [page, setPage] = useState(1);
  const [workersPerPage] = useState(5);
  const token = localStorage.getItem("adtoken");

  const getAllWorkers = async () => {
    if (token) {
      const result = await getAdminAllworkersAPI(token);
      if (result.length) {
        setAllWorkers(result);
      } else {
        console.log(result);
      }
    } else {
      console.log("Token not found");
    }
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

  const handleOpenDialog = (worker: Worker) => {
    setCurrentWorker(worker);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentWorker(null);
  };

  const handleDeleteWorker = async () => {
    if (currentWorker) {
      try {
        await deleteWorkerAPI(currentWorker._id, token || "");
        toast.success("Worker deleted successfully");
        getAllWorkers();
        handleCloseDialog();
      } catch (error) {
        toast.error("Failed to delete worker");
      }
    }
  };

  const handleOpenKycModal = (worker: Worker) => {
    setSelectedWorker(worker);
    setCurrentKycImages(0); 
    setShowKycModal(true);
  };

  useEffect(() => {
    getAllWorkers();
  }, []);

  const filteredWorkers = allWorkers
    .filter((worker) => worker.status === "approved")
    .filter((worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const indexOfLastWorker = page * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = filteredWorkers.slice(
    indexOfFirstWorker,
    indexOfLastWorker
  );
  const totalPages = Math.ceil(filteredWorkers.length / workersPerPage);

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
        <h1 className="text-3xl font-bold text-gray-700">Worker Management</h1>
        <TextField
          label="Search Worker"
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
                "Register Image",
                "Name",
                "Phone",
                "Categories",
                "Work Images",
                "KYC Details",
                "Action",
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
            {currentWorkers.map((worker, index) => (
              <TableRow
                key={worker._id}
                className="hover:bg-gray-100"
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  className="text-center"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  {index + 1 + indexOfFirstWorker}
                </TableCell>
                <TableCell className="text-center">
                  <img
                    src={worker.registerImage}
                    alt="Worker"
                    className="rounded-full"
                    style={{ width: "50px", height: "50px" }}
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
                <TableCell
                  className="text-center cursor-pointer"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleImageClick(worker.workImages, 0)}
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#115293",
                      },
                    }}
                  >
                    View Images
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                    <button
                      className="px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105 font-semibold"
                      onClick={() => handleOpenKycModal(worker)}
                    >
                      View KYC
                    </button>
                  </TableCell>
                <TableCell
                  className="text-center"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleOpenDialog(worker)}
                  >
                    Delete
                  </Button>
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

      {/* Modal for viewing images */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "600px", 
            height: "400px", 
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <img
            src={currentImages[currentImageIndex]}
            alt="Worker Work"
            style={{
              width: "100%", 
              height: "100%",
              objectFit: "contain", 
            }}
          />
          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              borderRadius: "50%",
              width: 40,
              height: 40,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              },
            }}
            aria-label="Previous Image"
          >
            <ArrowBackIosNewIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={handleNextImage}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              borderRadius: "50%",
              width: 40,
              height: 40,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              },
            }}
            aria-label="Next Image"
          >
            <ArrowForwardIosIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              borderRadius: "50%",
              width: 40,
              height: 40,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              },
            }}
            aria-label="Close Modal"
          >
            <span
              aria-hidden="true"
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              &times;
            </span>
          </IconButton>
        </Box>
      </Modal>

      <Modal
      open={showKycModal}
      onClose={() => setShowKycModal(false)}
      aria-labelledby="kyc-modal-title"
      aria-describedby="kyc-modal-description"
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
          width: '600px',
          height: '400px',
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
        {/* Close Button */}
        <IconButton
          onClick={() => setShowKycModal(false)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        

        {selectedWorker && selectedWorker.kycDetails.length > 0 ? (
          <>
            <img
              src={selectedWorker.kycDetails[currentKycImages]?.documentImage}
              alt="KYC"
              style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
            />
            <div className="flex justify-between mt-2">
              <IconButton
                onClick={() =>
                  setCurrentKycImages((prevIndex) =>
                    prevIndex === 0 ? selectedWorker.kycDetails.length - 1 : prevIndex - 1
                  )
                }
              >
                {/* Add left arrow icon */}
              </IconButton>
              <IconButton
                onClick={() =>
                  setCurrentKycImages((prevIndex) =>
                    prevIndex === selectedWorker.kycDetails.length - 1 ? 0 : prevIndex + 1
                  )
                }
              >
                {/* Add right arrow icon */}
              </IconButton>
            </div>
          </>
        ) : (
          <p>No KYC details available</p>
        )}
      </Box>
    </Modal>

      {/* Dialog for deleting a worker */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Worker</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this worker?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteWorker}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdWorkers;
