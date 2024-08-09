import { commonAPI } from "./CommonAPI";
import { SERVER_URL } from "./serverURL";

// SignUp API
export const SignUpAPI = async (reqBody: any, reqHeader: { "Content-Type": string } | undefined) => {
    return await commonAPI("POST", `${SERVER_URL}/signup`, reqBody, reqHeader);
}

// Login API
export const LoginAPI = async (reqBody: any) => {
    return await commonAPI("POST", `${SERVER_URL}/login`, reqBody);
}

export const GoogleLoginAPI=async(reqBody: any)=>{
  return await commonAPI("POST",`${SERVER_URL}/googleLogin`,reqBody,)
}



import axios from 'axios';

const api = axios.create({
  baseURL: `${SERVER_URL}/api/users`, // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const verifyOtp = async (data: any) => {
    return api.post('/verifyOtp', data);
  };