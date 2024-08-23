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
import { styled } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import BlockIcon from "@mui/icons-material/Block";
import SearchIcon from "@mui/icons-material/Search";
import { getAdminAllworkersAPI, deleteWorkerAPI } from "../../Services/allAPI";
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
  isBlocked: boolean;
  status: string;
}

const AdWorkers: React.FC = () => {
  const [allWorkers, setAllWorkers] = useState<Worker[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentWorker, setCurrentWorker] = useState<Worker | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
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
                <TableCell
                  className="text-center"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  {new Date(worker.createdAt).toLocaleDateString("en-GB")}
                </TableCell>
                <TableCell
                  className="text-center"
                  sx={{ fontSize: "16px", padding: "12px" }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<BlockIcon />}
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
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%",
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: "absolute",
              left: "5%",
              top: "50%",
              transform: "translateY(-50%)",
              color: "black",
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <img
            src={currentImages[currentImageIndex]}
            alt="Worker Image"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              borderRadius: "10px",
            }}
          />

          <IconButton
            onClick={handleNextImage}
            sx={{
              position: "absolute",
              right: "5%",
              top: "50%",
              transform: "translateY(-50%)",
              color: "black",
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Modal>

      {/* Dialog for deleting a worker */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Worker</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this worker?
          </Typography>
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
