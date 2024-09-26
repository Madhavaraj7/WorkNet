import mongoose from "mongoose";
import { Booking, IBooking } from "../domain/booking";
import { Slot } from "../domain/slot";
import { Wallet, WalletModel } from "../domain/wallet";


// Create a new booking and save it to the database.
export const createBooking = async (
  userId: string,
  slotId: string,
  workerId: string,
  amount: number
): Promise<IBooking> => {
  const booking = new Booking({ userId, slotId, workerId, amount });
  return booking.save();
};


// Cancel a booking by its ID and mark the associated slot as available.
export const cancelBooking = async (
  bookingId: string
): Promise<IBooking | null> => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    booking.status = "Cancelled";
    await booking.save();

    const slot = await Slot.findById(booking.slotId);
    if (slot) {
      slot.isAvailable = true;
      await slot.save();
    } else {
      throw new Error("Slot not found");
    }

    return booking;
  } catch (error) {
    console.error("Error cancelling the booking:", error);
    throw error;
  }
};


// Retrieve a booking by its ID from the database.
export const getBookingById = async (
  bookingId: string
): Promise<IBooking | null> => {
  return Booking.findById(bookingId).exec();
};

// Fetch the wallet information for a user by their user ID.
export const getWalletByUserId = async (
  userId: string
): Promise<Wallet | null> => {
  return WalletModel.findOne({ userId }).exec();
};

// Update the wallet balance for a user and record the transaction.
export const updateWallet = async (
  userId: string,
  amount: number
): Promise<Wallet | null> => {
  return WalletModel.findOneAndUpdate(
    { userId },
    {
      $inc: { walletBalance: amount },
      $push: {
        walletTransaction: {
          transactionDate: new Date(),
          transactionAmount: amount,
          transactionType: "credit",
        },
      },
    },
    { new: true }
  ).exec();
};

// Update the status of a booking by its ID.
export const updateBookingStatus = async (
  bookingId: mongoose.Schema.Types.ObjectId,
  status: "Pending" | "Confirmed" | "Cancelled"
): Promise<void> => {
  try {
    await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true, runValidators: true }
    );
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw new Error("Failed to update booking status");
  }
};
