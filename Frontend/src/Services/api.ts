import axios from 'axios';
import { SERVER_URL } from './serverURL';

const api = axios.create({
  baseURL: `${SERVER_URL}`, // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signUp = async (data: any) => {
  return api.post('/signUp', data);
};

export const verifyOtp = async (data: any) => {
  return api.post('/verifyOtp', data);
};

export const login = async (data: any) => {
  return api.post('/login', data);
};

// Add the resendOtp function
export const resendOtp = async (data: any) => {
  return api.post('/resendOtp', data);
};
