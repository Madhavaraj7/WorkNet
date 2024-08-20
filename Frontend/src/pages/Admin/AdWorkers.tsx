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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { getAdminAllworkersAPI, blockWorkerAPI, unblockWorkerAPI } from "../../Services/allAPI";
import { toast } from 'react-toastify';

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
  isBlocked: boolean;
}

const AdWorkers: React.FC = () => {
  const [allWorkers, setAllWorkers] = useState<Worker[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentWorker, setCurrentWorker] = useState<Worker | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
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

  const handleBlockUnblockWorker = async () => {
    if (currentWorker) {
      try {
        if (!currentWorker.isBlocked) {
          await blockWorkerAPI(currentWorker._id, token || '');
          toast.success("Worker blocked successfully");
        } else {
          await unblockWorkerAPI(currentWorker._id, token || '');
          toast.success("Worker unblocked successfully");
        }
        getAllWorkers(); 
        handleCloseDialog();
      } catch (error) {
        toast.error("Failed to update worker status");
      }
    }
  };

  useEffect(() => {
    getAllWorkers();
  }, []);

  const filteredWorkers = allWorkers.filter((worker) =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                "Created At",
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
            {filteredWorkers.map((worker, index) => (
              <TableRow
                key={worker._id}
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
                  {worker.categories}
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
      backgroundColor: '#1976d2',
      color: 'white',
      '&:hover': {
        backgroundColor: '#115293',
      },
    }}
  >
    View Images
  </Button>
</TableCell>
                <TableCell
                  className="text-center"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  {new Date(worker.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell
                  className="text-center"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  <Button
                    variant="contained"
                    color={worker.isBlocked ? "success" : "error"}
                    startIcon={worker.isBlocked ? <CheckCircleOutlineIcon /> : <BlockIcon />}
                    onClick={() => handleOpenDialog(worker)}
                  >
                    {worker.isBlocked ? "Unblock" : "Block"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Viewing Images */}
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

      {/* Dialog for Block/Unblock Confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentWorker && currentWorker.isBlocked ? "Unblock Worker" : "Block Worker"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {currentWorker && currentWorker.isBlocked ? "unblock" : "block"} this worker?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBlockUnblockWorker} color="secondary">
            {currentWorker && currentWorker.isBlocked ? "Unblock" : "Block"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdWorkers;
