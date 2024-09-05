// src/application/walletService.ts

import { WalletModel } from '../domain/wallet';



export const getWalletByUserId = async (userId: string) => {
    return await WalletModel.findOne({ userId }).exec();
};
