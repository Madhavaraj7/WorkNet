import { commonAPI } from "./CommonAPI";
import { SERVER_URL } from "./serverURL";

import axios from "axios";

const api = axios.create({
  baseURL: `${SERVER_URL}/api/users`,
  headers: {
    "Content-Type": "application/json",
  },
});
// Define a type for request headers that can include additional properties
type RequestHeaders = Record<string, string>;

// SignUp API
export const SignUpAPI = async (reqBody: any, reqHeader?: RequestHeaders) => {
  return await commonAPI("POST", `${SERVER_URL}/signup`, reqBody, reqHeader);
};

// Login API
export const LoginAPI = async (reqBody: any) => {
  return await commonAPI("POST", `${SERVER_URL}/login`, reqBody);
};

// Google Api
export const GoogleLoginAPI = async (reqBody: any) => {
  return await commonAPI("POST", `${SERVER_URL}/googleLogin`, reqBody);
};

// Verify OTP API
export const verifyOtp = async (data: any) => {
  return api.post("/verifyOtp", data);
};

// Update User Profile
export const updateUserProfileAPI = async (
  reqBody: any,
  reqHeader?: RequestHeaders
) => {
  return await commonAPI("PUT", `${SERVER_URL}/profile`, reqBody, reqHeader);
};

// Forgot Password API
export const ForgotPasswordAPI = async (email: string) => {
  return await commonAPI("POST", `${SERVER_URL}/forgotPassword`, { email });
};

// Reset Password API
export const VerifyResetPasswordAPI = async (
  email: any,
  otp: any,
  newPassword: any
) => {
  const reqBody = { email, otp, newPassword };
  return await commonAPI("POST", `${SERVER_URL}/resetPassword`, reqBody);
};

// Admin Login API
export const AdminLoginAPI = async (reqBody: any) => {
  return await commonAPI("POST", `${SERVER_URL}/adminLogin`, reqBody);
};

// Update Admin Profile
export const updateAdminProfileAPI = async (
  reqBody: any,
  reqHeader?: RequestHeaders
) => {
  return await commonAPI("PUT", `${SERVER_URL}/profile`, reqBody, reqHeader);
};

// Get All Users API
export const getAllUsersAPI = async (token: string) => {
  try {
    const response = await commonAPI(
      "GET",
      `${SERVER_URL}/getAllUsers`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log(response);

    return response;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

// Block User API
export const blockUserAPI = async (userId: string, token: string) => {
  return await axios.put(
    `${SERVER_URL}/blockUser/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const unblockUserAPI = async (userId: string, token: string) => {
  return await axios.put(
    `${SERVER_URL}/unblockUser/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Worker Registration API
export const registerWorkerAPI = async (
  reqBody: any,
  reqHeader?: RequestHeaders
) => {
  return await commonAPI("POST", `${SERVER_URL}/register`, reqBody, reqHeader);
};

// Get All Workers API
export const getAdminAllworkersAPI = async (token: string) => {
  try {
    const response = await commonAPI(
      "GET",
      `${SERVER_URL}/getAllWorkers`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    throw new Error("Failed to fetch workers");
  }
};

// Update Worker Status API
export const updateStatusAPI = async (
  workerId: string,
  status: string,
  token: string
) => {
  try {
    const response = await commonAPI(
      "PUT",
      `${SERVER_URL}/updateWorkerStatus/${workerId}`,
      { status },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    throw new Error("Failed to update worker status");
  }
};

// Block Worker API
export const blockWorkerAPI = async (workerId: string, token: string) => {
  return await commonAPI(
    "PUT",
    `${SERVER_URL}/blockWorker/${workerId}`,
    {},
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

// Unblock Worker API
export const unblockWorkerAPI = async (workerId: string, token: string) => {
  return await commonAPI(
    "PUT",
    `${SERVER_URL}/unblockWorker/${workerId}`,
    {},
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

// Get Worker Details API

export const getLoginedUserWorksAPI = async (token: string) => {
  try {
    const response = await commonAPI(
      "GET",
      `${SERVER_URL}/getUserWorkDetails`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    throw new Error("Failed to fetch user works");
  }
};

// Get All Workers API
export const getAllWorkersAPI = async () => {
  try {
    const response = await commonAPI(
      "GET",
      `${SERVER_URL}/getWorkers`,
      undefined,
      {}
    );
    return response;
  } catch (error) {
    throw new Error("Failed to fetch workers");
  }
};

// Show One Worker
export const getAWorkerAPI = async (wId: any) => {
  return await commonAPI("GET", `${SERVER_URL}/worker/${wId}`, "");
};

// Delete Worker API
export const deleteWorkerAPI = async (workerId: string, token: string) => {
  return await commonAPI(
    "DELETE",
    `${SERVER_URL}/deleteWorker/${workerId}`,
    undefined,
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

// Update Worker API
export const updateWorkerAPI = async (reqBody: FormData, token: string) => {
  try {
    // Note: Do not set Content-Type header manually
    const response = await axios.put(`${SERVER_URL}/updateWorker`, reqBody, {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Content-Type header is not required for FormData
      }
    });

    console.log('API response:', response.data);
    return response.data; // Ensure the response is in the expected format
  } catch (error) {
    console.error('Error in updateWorkerAPI:', error); // Log detailed error for debugging
    throw new Error('Failed to update worker');
  }
};



// Get Categories API
export const getCategoriesAPI = async () => {
  try {
    const response = await commonAPI(
      "GET",
      `${SERVER_URL}/categories`,
      undefined,
      {}
    );
    return response;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};

// Get All Categories (Admin)
export const getAdminCategoriesAPI = async (token: string) => {
  try {
    const response = await commonAPI(
      "GET",
      `${SERVER_URL}/Adcategories`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};

// Add New Category (Admin)
export const addCategoryAPI = async (categoryData: any, token: string) => {
  try {
    const response = await commonAPI(
      "POST",
      `${SERVER_URL}/categories`,
      categoryData,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    throw new Error("Failed to add category");
  }
};

export const editCategoryAPI = async (
  id: string,
  categoryData: any,
  token: string
) => {
  try {
    console.log("Editing category with ID:", id); // Debugging line

    const response = await commonAPI(
      "PUT",
      `${SERVER_URL}/editCategory/${id}`, // Ensure this URL matches your backend
      categoryData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    return response;
  } catch (error) {
    console.error("Error in editCategoryAPI:", error); // Log error details
    throw new Error("Failed to edit category");
  }
};

// Create Slot API
export const createSlotAPI = async (reqBody: any, token: string) => {
  try {
    const response = await commonAPI(
      "POST",
      `${SERVER_URL}/create-slot`,
      reqBody,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    throw new Error("Failed to create slot");
  }
};



// Get Slots by Worker API
export const getSlotsByWorkerAPI = async (token: string) => {
  try {
    const response = await commonAPI(
      "GET",
      `${SERVER_URL}/slots`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    throw new Error("Failed to fetch slots by worker");
  }
};



// Get Slots by Worker ID API
export const getSlotsByWorkerIdAPI = async (workerId: string, token: string) => {
  try {
    const response = await commonAPI(
      "GET",
      `${SERVER_URL}/worker/${workerId}/slots`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    console.error("Error in getSlotsByWorkerIdAPI:", error); // Log detailed error for debugging
    throw new Error("Failed to fetch slots by worker");
  }
};
