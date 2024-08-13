import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { Button, TextField, CircularProgress } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { updateUserProfileAPI } from "../Services/allAPI";
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

function Profile() {
  const navigate = useNavigate();
  const { setProfileUpdateResponse } = useContext(profileUpdateResponseContext) as any;
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    profileImage: "",
    username: JSON.parse(localStorage.getItem("user") || "{}")?.username || "",
    email: JSON.parse(localStorage.getItem("user") || "{}")?.email || "",
    oldPassword: "",
    newPassword: ""
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setProfileImagePreview(user.profileImage || "");
    setUserProfile(prev => ({
      ...prev,
      profileImage: user.profileImage || ""
    }));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setUserProfile(prev => ({
        ...prev,
        profileImage: file
      }));
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
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
    reqBody.append("profileImage", profileImage instanceof File ? profileImage : profileImagePreview);
    if (newPassword) {
      reqBody.append("oldPassword", oldPassword || "");
      reqBody.append("newPassword", newPassword || "");
    }

    if (token) {
      setLoading(true);
      try {
        const reqHeader = {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        };
        const result = await updateUserProfileAPI(reqBody, reqHeader);

        if (result._id) {
          toast.success("Your profile updated successfully");
          localStorage.setItem("user", JSON.stringify(result));
          setProfileUpdateResponse(result);
          navigate('/');
        } else {
          toast.info(result.response || "Something went wrong!");
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred while updating your profile.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Header />
      <br />
      <br />
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-grow flex justify-start items-start py-12 px-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
            <div className="flex justify-start mb-6">
              <label className="relative cursor-pointer">
                <input 
                  onChange={handleImageChange}
                  className="hidden"
                  type="file"
                />
                <div
                  style={{ backgroundImage: profileImagePreview ? `url(${profileImagePreview})` : `url(${SERVER_URL}/uploads/${profileImagePreview})` }}
                  className="w-32 h-32 rounded-full bg-cover bg-center flex justify-center items-center border-2 border-gray-300"
                >
                  <AddAPhotoIcon className="text-white absolute bottom-2 right-2" fontSize="large" />
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
        <Footer />
      </div>
    </>
  );
}

export default Profile;
