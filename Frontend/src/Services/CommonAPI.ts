import axios from 'axios';

export const commonAPI = async (
  method: string,
  url: string,
  body?: any,
  headers: Record<string, string> = {}
) => {
  try {
    const response = await axios.request({
      url,
      method,
      data: body,
      headers, // Spread headers directly, no need to check for headers being undefined
    });
    return response.data;
  } catch (error) {
    console.error('Error in commonAPI:', error);
    throw error;
  }
};
