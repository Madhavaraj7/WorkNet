import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { TextField, CircularProgress, Button } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import {
  updateUserProfileAPI,
  getLoginedUserWorksAPI,
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
  _id: string;
  registerImage: string;
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
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchWorkerDetails();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setUserProfile((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
          navigate("/");
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

  const handleClick = () => {
    navigate("/register");
  };

  const handleClickUpdate = () => {
    navigate("/updateWorker");
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
                  onChange={handleImageChange}
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
              type="text"
              className="w-full"
              label="Username"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="email"
              value={userProfile.email}
              type="text"
              className="w-full"
              label="Email"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: "#f5f5f5" }}
            />
            <TextField
              name="oldPassword"
              value={userProfile.oldPassword}
              onChange={handleFieldChange}
              type="password"
              className="w-full"
              label="Old Password"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="newPassword"
              value={userProfile.newPassword}
              onChange={handleFieldChange}
              type="password"
              className="w-full"
              label="New Password"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <Button
              onClick={handleUpdate}
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </div>
        </div>

        {/* centre side */}

        <div className="flex-grow flex justify-start items-start py-12 px-4 lg:w-1/2">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-5">
            <img
              src="/src/assets/user.gif"
              alt="Update Profile GIF"
              className="w-full h-auto max-w-xs mx-auto"
            />
            <h2 className="text-5xl font-semibold text-gray-800 mb-6">
              Update Your Profile Now!
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Customize your profile to reflect your true self. Update your
              details and make sure everything is accurate your journey starts
              here!
            </p>
          </div>
        </div>

        {/* Right side worker details */}
        <div className="flex-grow flex justify-start items-start py-12 px-10 lg:w-1/2">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 space-y-4 flex flex-col justify-between">
            {workerDetails ? (
              <>
                <div>
                  <div className="flex flex-col items-center">
                    <img
                      className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-lg"
                      src={workerDetails.registerImage}
                      alt={workerDetails.name}
                    />
                    <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                      {workerDetails.name}
                    </h2>
                    <p className="text-gray-500">{workerDetails.phoneNumber}</p>
                  </div>
                  <div className=" border-gray-200 mt-4 pt-4 space-y-4">
                    <div className="flex items-start">
                      <h3 className="w-1/3 text-lg font-semibold text-gray-800">
                        Categories
                      </h3>
                      <p className="w-2/3 text-gray-600">
                        {workerDetails.categories.join(", ")}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <h3 className="w-1/3 text-lg font-semibold text-gray-800">
                        Experience
                      </h3>
                      <p className="w-2/3 text-gray-600">
                        {workerDetails.experience} years
                      </p>
                    </div>
                    <div className="flex items-start">
                      <h3 className="w-1/3 text-lg font-semibold text-gray-800">
                        Working Days
                      </h3>
                      <p className="w-2/3 text-gray-600">
                        {workerDetails.workingDays}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <h3 className="w-1/3 text-lg font-semibold text-gray-800">
                        Available Time
                      </h3>
                      <p className="w-2/3 text-gray-600">
                        {workerDetails.availableTime}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <h3 className="w-1/3 text-lg font-semibold text-gray-800">
                        Address
                      </h3>
                      <p className="w-2/3 text-gray-600">
                        {workerDetails.address}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <h3 className="w-1/3 text-lg font-semibold text-gray-800">
                        Payment Mode
                      </h3>
                      <p className="w-2/3 text-gray-600">
                        {workerDetails.paymentMode}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleClickUpdate}
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full transform transition-transform hover:scale-105 shadow-lg"
                >
                  Update Worker Details
                </Button>
              </>
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
                  <h2 className="text-4xl font-semibold text-gray-800 mb-6">
                    Join Our Team Now!
                  </h2>
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    Ready to make an impact? Register now to become a part of
                    our growing team. Update your profile to reflect your skills
                    and expertise. Your journey starts here!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
