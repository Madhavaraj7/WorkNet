// src/controllers/walletController.ts
import { Request, Response } from "express";
import { getWalletByUserId } from "../../application/walletService";

export const getWalletBalance = async (req: any, res: Response) => {
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    res.status(200).json({
      walletBalance: wallet.walletBalance,
      walletTransactions: wallet.walletTransaction,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
