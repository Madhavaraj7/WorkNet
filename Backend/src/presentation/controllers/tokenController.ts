import { Request, Response } from "express";
import { refreshAccessToken } from "../../application/userService";

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const { accessToken } = await refreshAccessToken(refreshToken);
        res.status(200).json({ accessToken });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
