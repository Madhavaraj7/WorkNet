// src/domain/wallet.ts
import mongoose, { Document, Schema } from 'mongoose';

interface WalletTransaction {
  transactionDate: Date;
  transactionAmount: number;
  transactionType: 'credit' | 'debit';
}

export interface Wallet extends Document {
  userId: mongoose.Types.ObjectId;
  walletBalance: number;
  walletTransaction: WalletTransaction[];
}

const walletSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
  walletBalance: { type: Number, default: 0 },
  walletTransaction: [
    {
      transactionDate: { type: Date, default: Date.now },
      transactionAmount: { type: Number, required: true },
      transactionType: { type: String, enum: ['credit', 'debit'], required: true },
    },
  ],
});

export const WalletModel = mongoose.model<Wallet>('Wallet', walletSchema);
