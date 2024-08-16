import axios from 'axios';

// If you don't need a specific axios instance, you can use default axios
export const commonAPI = async (method: string, url: string, body?: any, headers?: Record<string, string>) => {
  try {
    const response = await axios.request({
      url,
      method,
      data: body,
      headers: headers ? { ...headers } : {},
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
