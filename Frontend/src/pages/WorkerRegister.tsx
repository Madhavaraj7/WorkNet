import React, { useEffect, useState, ChangeEvent } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Backdrop,
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerWorkerAPI } from "../Services/allAPI";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { city } from "../assets/AllCities/Cities";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface RegisterData {
  registerImage: File | null;
  name: string;
  phoneNumber: string;
  whatsappNumber: string;
  categories: string[];
  experience: string;
  workingDays: string;
  availableTime: string;
  address: string;
  paymentMode: string;
  state: string;
  city: string;
  place: string;
  workImages: File[];
}

function WorkerRegister() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [registerData, setRegisterData] = useState<RegisterData>({
    registerImage: null,
    name: "",
    phoneNumber: "",
    whatsappNumber: "",
    categories: [],
    experience: "",
    workingDays: "",
    availableTime: "",
    address: "",
    paymentMode: "",
    state: "",
    city: "",
    place: "",
    workImages: [],
  });
  const [regImagePreview, setRegImagePreview] = useState<string>("");
  const [preview, setPreview] = useState<string[]>([]);
  const [IndianStates, setIndianStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const theme = useTheme();
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  useEffect(() => {
    if (registerData.workImages.length > 0) {
      setPreview(
        registerData.workImages.map((image) => URL.createObjectURL(image))
      );
    }
    if (registerData.registerImage) {
      setRegImagePreview(URL.createObjectURL(registerData.registerImage));
    }
  }, [registerData.workImages, registerData.registerImage]);

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const categories = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Welding",
    "TileWork",
    "Centring",
    "Construction",
    "Fabrication",
  ];

  const workingDaysOptions = [
    "All Days",
    "Monday to Saturday",
    "Monday to Friday",
    "Saturday and Sunday",
  ];

  const timeSlots = [
    "24 Hours",
    "9 AM to 6 PM",
    "10 AM to 5 PM",
    "9 AM to 9 PM",
  ];

  const paymentModes = ["Cash", "Online"];

  const getStyles = (name: string, personName: string[], theme: any) => ({
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  });

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setRegisterData((prevData) => ({
      ...prevData,
      categories: value,
    }));
  };

  useEffect(() => {
    const states = Array.from(new Set(city.map((cityItem) => cityItem.state)));
    setIndianStates(states);
  }, []);

  useEffect(() => {
    if (registerData.state) {
      const selectedStateCities = city
        .filter((cityItem) => cityItem.state === registerData.state)
        .map((cityItem) => cityItem.name);
      setCities(selectedStateCities);
    } else {
      setCities([]);
    }
  }, [registerData.state]);

  const handleSubmit = async () => {
    const {
      registerImage,
      name,
      phoneNumber,
      whatsappNumber,
      categories,
      experience,
      workingDays,
      availableTime,
      address,
      paymentMode,
      state,
      city,
      place,
      workImages,
    } = registerData;

    if (
      !registerImage ||
      !name ||
      !phoneNumber ||
      !whatsappNumber ||
      !categories.length ||
      !experience ||
      !workingDays ||
      !availableTime ||
      !address ||
      !paymentMode ||
      !state ||
      !city ||
      !place ||
      workImages.length === 0
    ) {
      toast.warning("Please fill the form completely!");
      return;
    }

    if (workImages.length >= 3) {
      setLoading(true); // Set loading to true

      const reqBody = new FormData();
      reqBody.append("registerImage", registerImage);
      reqBody.append("name", name);
      reqBody.append("phoneNumber", phoneNumber);
      reqBody.append("whatsappNumber", whatsappNumber);
      reqBody.append("categories", categories.join(","));
      reqBody.append("experience", experience);
      reqBody.append("workingDays", workingDays);
      reqBody.append("availableTime", availableTime);
      reqBody.append("address", address);
      reqBody.append("paymentMode", paymentMode);
      reqBody.append("state", state);
      reqBody.append("city", city);
      reqBody.append("place", place);
      for (const image of workImages) {
        reqBody.append("workImages", image);
      }
      const token = localStorage.getItem("token");
      if (token) {
        const reqHeader = {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        };
        try {
          const result = await registerWorkerAPI(reqBody, reqHeader);
          console.log(result);

          if (result.userId) {
            // localStorage.setItem("worker", JSON.stringify(registerData));

            setRegisterData({
              registerImage: null,
              name: "",
              phoneNumber: "",
              whatsappNumber: "",
              categories: [],
              experience: "",
              workingDays: "",
              availableTime: "",
              address: "",
              paymentMode: "",
              state: "",
              city: "",
              place: "",
              workImages: [],
            });
            toast.success("Your Registration Successfully!");
            navigate("/");
          } else {
            toast.info(result.response || "Registration failed");
          }
        } catch (err: any) {
          if (err.response?.status === 409) {
            toast.error("Worker already registered!");
          } else {
            toast.error("An unexpected error occurred!");
          }
          console.log(err);
        } finally {
          setLoading(false); // Set loading to false after the process
        }
      }
    } else {
      toast.error("Upload at least 3 images!");
    }
  };

  const handleRemoveImage = (index: number) => {
    setRegisterData((prevData) => {
      const updatedImages = [...prevData.workImages];
      updatedImages.splice(index, 1);
      return {
        ...prevData,
        workImages: updatedImages,
      };
    });
    setPreview((prevPreview) => {
      const updatedPreview = [...prevPreview];
      updatedPreview.splice(index, 1);
      return updatedPreview;
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setRegisterData((prevData) => ({
        ...prevData,
        workImages: [...prevData.workImages, ...newFiles],
      }));
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress size={60} color="success" />
      </Backdrop>
      <Header />
      <br />
      <br />
      <br />

      <Box sx={{ minHeight: "100vh", py: 5 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, boxShadow: 3 }}>
              <CardContent>
                <Box textAlign="center" mb={2}>
                  <label className="cursor-pointer">
                    <input
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          registerImage: e.target.files
                            ? e.target.files[0]
                            : null,
                        })
                      }
                      className="hidden"
                      type="file"
                      name="registerImage"
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        width: 150,
                        height: 150,
                        mx: "auto",
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor: theme.palette.primary.main,
                        backgroundColor: theme.palette.grey[200],
                        boxShadow: `0 4px 8px rgba(0, 0, 0, 0.1)`,
                      }}
                    >
                      {regImagePreview ? (
                        <img
                          src={regImagePreview}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            width: "100%",
                          }}
                        >
                          <AccountCircleIcon
                            sx={{
                              fontSize: 80,
                              color: theme.palette.grey[500],
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </label>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company/Name"
                      variant="outlined"
                      value={registerData.name}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      variant="outlined"
                      type="number"
                      value={registerData.phoneNumber}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Whatsapp Number"
                      variant="outlined"
                      type="number"
                      value={registerData.whatsappNumber}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          whatsappNumber: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Categories</InputLabel>

                      <Select
                        label="Categories"
                        multiple
                        value={registerData.categories}
                        onChange={handleChange}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {categories.map((category) => (
                          <MenuItem
                            key={category}
                            value={category}
                            style={getStyles(
                              category,
                              registerData.categories,
                              theme
                            )}
                          >
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        label="Experience"
                        variant="outlined"
                        type="number"
                        value={registerData.experience}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            experience: e.target.value,
                          })
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Working Days</InputLabel>
                      <Select
                        label="Working Days"
                        value={registerData.workingDays}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            workingDays: e.target.value,
                          })
                        }
                      >
                        {workingDaysOptions.map((day) => (
                          <MenuItem key={day} value={day}>
                            {day}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Available Time</InputLabel>
                      <Select
                        label="Available Time"
                        value={registerData.availableTime}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            availableTime: e.target.value,
                          })
                        }
                      >
                        {timeSlots.map((slot) => (
                          <MenuItem key={slot} value={slot}>
                            {slot}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Address"
                      variant="outlined"
                      value={registerData.address}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          address: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Payment Mode</InputLabel>
                      <Select
                        label="Payment Mode"
                        value={registerData.paymentMode}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            paymentMode: e.target.value,
                          })
                        }
                      >
                        {paymentModes.map((mode) => (
                          <MenuItem key={mode} value={mode}>
                            {mode}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>State</InputLabel>
                      <Select
                        value={registerData.state}
                        label="State"
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            state: e.target.value,
                          })
                        }
                      >
                        {IndianStates.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>City</InputLabel>
                      <Select
                        label="City"
                        value={registerData.city}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            city: e.target.value,
                          })
                        }
                      >
                        {cities.map((city) => (
                          <MenuItem key={city} value={city}>
                            {city}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Place"
                      variant="outlined"
                      value={registerData.place}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          place: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>

                <Box mt={4}>
                  <div className="flex flex-col items-center mt-8">
                    <h3 className="text-2xl font-bold mb-2">
                      Upload Your Works Images
                    </h3>
                    <p className="text-red-500 text-sm">
                      *Upload at least three photos*
                    </p>
                  </div>
                  <br />
                  <Grid container spacing={2}>
                    {preview.map((image, index) => (
                      <Grid item xs={4} md={3} key={index}>
                        <Card
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: 150,
                            boxShadow: 3,
                            borderRadius: "8px",
                          }}
                        >
                          <img
                            src={image}
                            alt={`Work ${index}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                          <Button
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              backgroundColor: theme.palette.error.main,
                              color: theme.palette.error.contrastText,
                              "&:hover": {
                                backgroundColor: theme.palette.error.dark,
                              },
                            }}
                            onClick={() => handleRemoveImage(index)}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "inherit" }}
                            >
                              Remove
                            </Typography>
                          </Button>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                    Upload Images
                    <input
                      type="file"
                      multiple
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>
                </Box>
                <Box mt={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading} // Disable button when loading
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : "Register"}{" "}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </>
  );
}

export default WorkerRegister;
