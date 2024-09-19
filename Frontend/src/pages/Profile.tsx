import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import {
  TextField,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CardContent,
  Card,
  TablePagination,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import {
  updateUserProfileAPI,
  getLoginedUserWorksAPI,
  updateWorkerAPI,
  createSlotAPI,
  getSlotsByWorkerAPI,
  getWorkerAppointmentsAPI,
} from "../Services/allAPI";
import { SERVER_URL } from "../Services/serverURL";
import { toast } from "react-toastify";
import { profileUpdateResponseContext } from "../ContextAPI/AvarageRes";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  profileImage: File | string;
  username: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
}

interface WorkerDetails {
  whatsappNumber: any;
  kycDetails: any;
  amount: any;
  registerImage: File | string;
  _id: string;
  name: string;
  phoneNumber: string;
  categories: string[];
  experience: number;
  workingDays: string;
  availableTime: string;
  address: string;
  paymentMode: string;
  state: string;
  city: string;
  place: string;
  workImages: string[];
  workerHours: string; // Added
  slots?: Array<{ startDate: string; endDate: string }>; // Added
}
interface Slot {
  startDate: string;
  endDate: string;
}

export interface Appointment {
  appointmentId: string;
  userName: string;
  slotDate: string;
  amount: number;
  status: string;
}

function Profile() {
  const navigate = useNavigate();
  const { setProfileUpdateResponse } = useContext(
    profileUpdateResponseContext
  ) as any;
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    profileImage: "",
    username: JSON.parse(localStorage.getItem("user") || "{}")?.username || "",
    email: JSON.parse(localStorage.getItem("user") || "{}")?.email || "",
    oldPassword: "",
    newPassword: "",
  });
  const [workerDetails, setWorkerDetails] = useState<WorkerDetails | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [workerImagePreview, setWorkerImagePreview] = useState<string>("");
  const [newSlot, setNewSlot] = useState<Slot>({ startDate: "", endDate: "" });
  const [newSlots, setNewSlots] = useState<Slot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const rowsPerPages = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const [, setError] = useState("");
  const [page, setPage] = useState(0); // Current page index
  const rowsPerPage = 1; // Number of rows per page

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setProfileImagePreview(user.profileImage || "");
    setUserProfile((prev) => ({
      ...prev,
      profileImage: user.profileImage || "",
    }));

    const fetchWorkerDetails = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = await getLoginedUserWorksAPI(token);
          setWorkerDetails(data);
          setWorkerImagePreview(data.registerImage || "");
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchWorkerDetails();
  }, []);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isWorker: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isWorker) {
          setWorkerImagePreview(reader.result as string);
          setWorkerDetails((prev) =>
            prev ? { ...prev, registerImage: file } : prev
          );
        } else {
          setProfileImagePreview(reader.result as string);
          setUserProfile((prev) => ({
            ...prev,
            registerImage: file,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isWorker: boolean = false
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;

    if (isWorker) {
      setWorkerDetails((prev) => (prev ? { ...prev, [name]: value } : prev));
    } else {
      setUserProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

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


  const handleUpdate = async () => {
    const { username, profileImage, oldPassword, newPassword } = userProfile;
    const token = localStorage.getItem("token");

    if (!username) {
      toast.warning("Please fill the form completely!");
      return;
    }

    if (newPassword && !oldPassword) {
      toast.warning("Please enter your old password to change the password!");
      return;
    }

    const reqBody = new FormData();
    reqBody.append("username", username);
    reqBody.append(
      "profileImage",
      profileImage instanceof File ? profileImage : profileImagePreview
    );
    if (newPassword) {
      reqBody.append("oldPassword", oldPassword || "");
      reqBody.append("newPassword", newPassword || "");
    }

    if (token) {
      setLoading(true);
      try {
        const reqHeader = {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        };
        const result = await updateUserProfileAPI(reqBody, reqHeader);

        if (result._id) {
          toast.success("Your profile updated successfully");
          localStorage.setItem("user", JSON.stringify(result));
          setProfileUpdateResponse(result);
          // navigate("/");
        } else {
          toast.info(result.response || "Something went wrong!");
        }
      } catch (err: any) {
        if (err.response && err.response.status === 403) {
          toast.warning("Your account is blocked. Please contact support.");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.error(err);
          toast.error("An error occurred while updating your profile.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleWorkerUpdate = async () => {
    const token = localStorage.getItem("token");

    if (!workerDetails) {
      toast.warning("No worker details available for update!");
      return;
    }

    const reqBody = new FormData();
    reqBody.append("name", workerDetails.name);
    reqBody.append("phoneNumber", workerDetails.phoneNumber.toString());
    reqBody.append("whatsappNumber", workerDetails.whatsappNumber.toString());
    reqBody.append("categories", JSON.stringify(workerDetails.categories));
    reqBody.append("experience", workerDetails.experience.toString());
    reqBody.append("workingDays", workerDetails.workingDays);
    reqBody.append("availableTime", workerDetails.availableTime);
    reqBody.append("address", workerDetails.address);
    reqBody.append("paymentMode", workerDetails.paymentMode);
    reqBody.append("state", workerDetails.state);
    reqBody.append("city", workerDetails.city);
    reqBody.append("place", workerDetails.place);
    reqBody.append("workerHours", workerDetails.workerHours); // Added
    reqBody.append(
      "registerImage",
      workerDetails.registerImage instanceof File
        ? workerDetails.registerImage
        : workerImagePreview
    );
    reqBody.append("amount", workerDetails.amount.toString());

    if (token) {
      setLoading(true);
      try {
        const result = await updateWorkerAPI(reqBody, token);
        console.log(updateWorkerAPI);

        if (result) {
          toast.success("Worker details updated successfully");
          setWorkerDetails(result);
        } else {
          toast.info(result || "Something went wrong!");
        }
      } catch (err: any) {
        console.error(err);
        toast.error("An error occurred while updating worker details.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDropdownChange = (
    e: SelectChangeEvent<string>,
    name: string,
    isWorker: boolean = false
  ) => {
    const value = e.target.value as string;
    if (isWorker) {
      setWorkerDetails((prev) => (prev ? { ...prev, [name]: value } : prev));
    } else {
      setUserProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSlot((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchSlots = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const slotsData = await getSlotsByWorkerAPI(token);
          setNewSlots(slotsData);
        } catch (err) {
          console.error(err);
          // toast.error("Failed to load slots.");
        }
      }
    };

    fetchSlots();
  }, []);

  const handleSlotSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!newSlot.startDate || !newSlot.endDate) {
      toast.warning("Please fill out both start date and end date.");
      return;
    }

    if (new Date(newSlot.startDate) > new Date(newSlot.endDate)) {
      toast.warning("End Date must be later than Start Date.");
      return;
    }

    if (!token) {
      toast.error("No token found, please log in again.");
      return;
    }

    try {
      await createSlotAPI(newSlot, token);
      toast.success("Slot created successfully!");

      const slotsData = await getSlotsByWorkerAPI(token);
      console.log(slotsData);

      setNewSlots(slotsData);

      setNewSlot({ startDate: "", endDate: "" });
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while creating the slot.");
    }
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

  const handleClick = () => {
    navigate("/register");
  };

  // Paginate the slots
  const filteredSlots = newSlots
    .filter(
      (slot, index, self) =>
        index ===
        self.findIndex(
          (s) => s.startDate === slot.startDate && s.endDate === slot.endDate
        )
    )
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

  // Calculate the current page data
  const paginatedSlots = filteredSlots.slice(page, page + 1);

  const handleChangePage = (
    _event: any,
    newPage: React.SetStateAction<number>
  ) => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = await getWorkerAppointmentsAPI(token);
          console.log(data);

          setAppointments(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError("No token found");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const totalPages = Math.ceil(appointments.length / rowsPerPages);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <Header />
      <br />
      <br />

      <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
        {/* Left side profile update */}
        <div className="flex-grow flex justify-start items-start py-12 px-4 lg:w-1/2">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
            <div className="flex justify-start mb-6">
              <label className="relative cursor-pointer">
                <input
                  onChange={(e) => handleImageChange(e)}
                  className="hidden"
                  type="file"
                />
                <div
                  style={{
                    backgroundImage: profileImagePreview
                      ? `url(${profileImagePreview})`
                      : `url(${SERVER_URL}/uploads/${profileImagePreview})`,
                  }}
                  className="w-32 h-32 rounded-full bg-cover bg-center flex justify-center items-center border-2 border-gray-300"
                >
                  <AddAPhotoIcon
                    className="text-white absolute bottom-2 right-2"
                    fontSize="large"
                  />
                </div>
              </label>
            </div>
            <TextField
              name="username"
              value={userProfile.username}
              onChange={handleFieldChange}
              fullWidth
              label="Username"
              variant="outlined"
            />
            <TextField
              name="email"
              value={userProfile.email}
              onChange={handleFieldChange}
              fullWidth
              label="Email"
              variant="outlined"
              disabled
            />
            <TextField
              name="oldPassword"
              type="password"
              value={userProfile.oldPassword}
              onChange={handleFieldChange}
              fullWidth
              label="Old Password"
              variant="outlined"
            />
            <TextField
              name="newPassword"
              type="password"
              value={userProfile.newPassword}
              onChange={handleFieldChange}
              fullWidth
              label="New Password"
              variant="outlined"
            />
            <div className="flex justify-center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Update Profile"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right side worker profile */}

        <div className="flex-grow flex justify-start items-start py-12 px-4 lg:w-1/2">
          {workerDetails ? (
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
              <div className="flex justify-start mb-6">
                <label className="relative cursor-pointer">
                  <input
                    onChange={(e) => handleImageChange(e, true)}
                    className="hidden"
                    type="file"
                  />
                  <div
                    style={{
                      backgroundImage: workerImagePreview
                        ? `url(${workerImagePreview})`
                        : `url(${SERVER_URL}/uploads/${workerDetails.registerImage})`,
                    }}
                    className="w-32 h-32 rounded-full bg-cover bg-center flex justify-center items-center border-2 border-gray-300"
                  >
                    <AddAPhotoIcon
                      className="text-white absolute bottom-2 right-2"
                      fontSize="large"
                    />
                  </div>
                </label>
              </div>
              <TextField
                name="name"
                value={workerDetails.name}
                onChange={(e) => handleFieldChange(e, true)}
                fullWidth
                label="Name"
                variant="outlined"
              />
              <TextField
                name="phoneNumber"
                value={workerDetails.phoneNumber}
                onChange={(e) => handleFieldChange(e, true)}
                fullWidth
                label="Phone Number"
                variant="outlined"
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel id="workingDays-label">Working Days</InputLabel>
                <Select
                  labelId="workingDays-label"
                  name="workingDays"
                  value={workerDetails?.workingDays || ""}
                  onChange={(e) => handleDropdownChange(e, "workingDays", true)}
                  label="Working Days"
                >
                  {workingDaysOptions.map((day, index) => (
                    <MenuItem key={index} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="availableTime-label">Available Time</InputLabel>
                <Select
                  labelId="availableTime-label"
                  name="availableTime"
                  value={workerDetails?.availableTime || ""}
                  onChange={(e) =>
                    handleDropdownChange(e, "availableTime", true)
                  }
                  label="Available Time"
                >
                  {timeSlots.map((slot, index) => (
                    <MenuItem key={index} value={slot}>
                      {slot}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleWorkerUpdate}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Update Worker"}
                </Button>
                {/* <Button
                  variant="contained"
                  color="secondary"
                  onClick={navigateToDetailsPage}
                >
                  Update More
                </Button> */}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className=" max-w-lg bg-white p-6 space-y-4 flex flex-col justify-between">
                <img
                  src="/src/assets/Images/EmptyWorker.gif"
                  alt="Register Worker GIF"
                  className="w-full h-auto max-w-xs mx-auto"
                />
                <button
                  onClick={handleClick}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                >
                  Register a Worker
                </button>
                <br />
                <br />
                <h2 className="text-4xl font-semibold text-gray-800 mb-6">
                  Join Our Team Now!
                </h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Ready to make an impact? Register now to become a part of our
                  growing team. Update your profile to reflect your skills and
                  expertise. Your journey starts here!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* slot side worker profile */}

        <div className="flex-grow flex justify-start items-start py-12 px-4 lg:w-1/2">
          {workerDetails ? (
           <Card>
           <CardContent>
             <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Slots</h2>
             <TextField
               label="Start Date"
               name="startDate"
               type="date"
               InputLabelProps={{ shrink: true }}
               value={newSlot.startDate}
               onChange={handleSlotChange}
               fullWidth
               margin="normal"
               inputProps={{ 
                 min: new Date(new Date().setDate(new Date().getDate() + 1))
                   .toISOString()
                   .split("T")[0], 
               }}
             />
             <TextField
               label="End Date"
               name="endDate"
               type="date"
               InputLabelProps={{ shrink: true }}
               value={newSlot.endDate}
               onChange={handleSlotChange}
               fullWidth
               margin="normal"
               inputProps={{ 
                 min: new Date(new Date().setDate(new Date().getDate() + 1))
                   .toISOString()
                   .split("T")[0], // Ensuring tomorrow's date
               }}
             />
             <Button
               variant="contained"
               color="primary"
               onClick={handleSlotSubmit}
               className="mt-4"
             >
               Create Slot
             </Button>
         
             <h3 className="text-lg font-semibold mt-8 mb-2">My Slots</h3>
             {newSlots.length > 0 ? (
               <>
                 {paginatedSlots.length > 0 ? (
                   paginatedSlots.map((slot, index) => (
                     <div
                       key={index}
                       className="bg-gradient-to-r from-blue-50 via-green-50 to-yellow-50 shadow-md rounded-lg border border-gray-300 p-6 mb-4"
                     >
                       <div className="flex justify-between items-center mb-4">
                         <div className="flex-1 mr-4">
                           <h3 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-500 pb-2 mb-2">
                             Start Date
                           </h3>
                           <p className="text-gray-700 text-lg">
                             {formatDate(slot.startDate)}
                           </p>
                         </div>
                         <div className="flex-1">
                           <h3 className="text-lg font-semibold text-green-800 border-b-2 border-green-500 pb-2 mb-2">
                             End Date
                           </h3>
                           <p className="text-gray-700 text-lg">
                             {formatDate(slot.endDate)}
                           </p>
                         </div>
                       </div>
                     </div>
                   ))
                 ) : (
                   <div className="text-center text-gray-600 py-6">No slots available.</div>
                 )}
                 <div className="flex justify-center mt-6">
                   <TablePagination
                     rowsPerPageOptions={[]}
                     component="div"
                     count={filteredSlots.length}
                     rowsPerPage={rowsPerPage}
                     page={page}
                     onPageChange={handleChangePage}
                     className="bg-white rounded-lg border border-gray-300 shadow-sm"
                   />
                 </div>
               </>
             ) : (
               <p className="text-center text-gray-600 py-6">No slots available.</p>
             )}
           </CardContent>
         </Card>
         
          ) : (
            <div></div>
          )}
        </div>
      </div>
      {workerDetails && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-w-7xl mx-auto mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            My Appointments
          </h2>
          {/* Heading */}

          <div className="max-h-[calc(5*4rem)] overflow-y-auto">
            {/* Table */}
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white rounded-t-lg">
                <tr>
                  <th className="py-3 px-5 text-left text-sm font-semibold">
                    User Name
                  </th>
                  <th className="py-3 px-5 text-left text-sm font-semibold">
                    Slot Date
                  </th>
                  <th className="py-3 px-5 text-left text-sm font-semibold">
                    Amount
                  </th>
                  <th className="py-3 px-5 text-left text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr
                      key={appointment.appointmentId}
                      className="hover:bg-gray-100 transition-colors duration-300"
                    >
                      <td className="py-3 px-5 text-gray-800 border-b text-sm">
                        {appointment.userName}
                      </td>
                      <td className="py-3 px-5 text-gray-800 border-b text-sm">
                        {new Date(appointment.slotDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-5 text-gray-800 border-b text-sm">
                        {appointment.amount}
                      </td>
                      <td className="py-3 px-5 text-gray-800 border-b text-sm">
                        {appointment.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4} 
                      className="py-3 px-5 text-center text-gray-500 text-sm"
                    >
                      No appointments available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Component */}
          <div className="py-4 px-5 flex justify-between items-center bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 transition"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 transition"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <br />
      <Footer />
    </>
  );
}

export default Profile;




