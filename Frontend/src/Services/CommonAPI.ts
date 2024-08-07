import axios from 'axios';

export const commonAPI = async (httpRequest: string, url: string, reqBody: any, reqHeader = {"Content-Type": "application/json"}) => {
    const reqConfig = {
        method: httpRequest,
        url,
        data: reqBody,
        headers: reqHeader,
    };
    try {
        const result = await axios(reqConfig);
        return result.data;
    } catch (err: any) {
        console.error("Error in commonAPI:", {
            message: err.message,
            config: err.config,
            request: err.request,
            response: err.response ? {
                data: err.response.data,
                status: err.response.status,
                headers: err.response.headers
            } : null
        });
        if (err.response) {
            return { error: true, message: err.response.data.message || "Request failed", status: err.response.status };
        } else if (err.request) {
            return { error: true, message: "No response received from the server", status: null };
        } else {
            return { error: true, message: err.message, status: null };
        }
    }
};
