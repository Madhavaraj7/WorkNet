// src/infrastructure/walletRepository.ts
import { WalletModel, Wallet } from "../domain/wallet";

export const findWalletByUserId = async (
  userId: string
): Promise<Wallet | null> => {
  return WalletModel.findOne({ userId });
};

export const updateWalletBalance = async (
  userId: string,
  newBalance: number,
  transaction: any
) => {
  return WalletModel.findOneAndUpdate(
    { userId },
    {
      $set: { walletBalance: newBalance },
      $push: { walletTransaction: transaction },
    },
    { new: true }
  );
};
