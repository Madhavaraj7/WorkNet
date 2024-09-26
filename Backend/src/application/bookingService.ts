import { Booking, IBooking } from "../domain/booking";
import { Slot } from "../domain/slot";
import { Worker } from "../domain/worker";
import {
  cancelBooking,
  createBooking as createBookingRepo,
  getBookingById,
  getWalletByUserId,
  updateWallet,
} from "../infrastructure/bookingRepository";
import {
  findWalletByUserId,
  updateWalletBalance,
} from "../infrastructure/walletRepository";

interface CancellationPolicy {
  refundPercentage: number;
  cancellable: boolean;
  reason?: string;
}


// Create a new booking if the slot and worker are available
export const createBooking = async (
  userId: string,
  slotId: string,
  workerId: string,
  amount: number
): Promise<IBooking> => {
  const slot = await Slot.findById(slotId).exec();
  if (!slot || !slot.isAvailable) {
    throw new Error("Slot is not available");
  }

  const worker = await Worker.findById(workerId).exec();
  if (!worker) {
    throw new Error("Worker not found");
  }

  return createBookingRepo(userId, slotId, workerId, amount);
};


// Update the booking status and mark the slot as unavailable if confirmed
export const updateBookingStatus = async (
  bookingId: string,
  status: "Pending" | "Confirmed" | "Cancelled"
): Promise<IBooking | null> => {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { status },
    { new: true }
  ).exec();

  if (booking && status === "Confirmed") {
    await Slot.findByIdAndUpdate(booking.slotId, { isAvailable: false }).exec();
  }

  return booking;
};


// Determine cancellation policy based on the time left before the event
const getCancellationPolicy = (
  bookingDate: Date,
  eventDate: Date
): CancellationPolicy => {
  const now = new Date();
  const hoursBeforeEvent =
    (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursBeforeEvent < 24) {
    return {
      refundPercentage: 0,
      cancellable: false,
      reason: "Cancellation not allowed within 24 hours of the event",
    };
  } else if (hoursBeforeEvent < 48) {
    return { refundPercentage: 50, cancellable: true };
  } else {
    return { refundPercentage: 100, cancellable: true };
  }
};


// Cancel a booking and refund the user based on the cancellation policy
export const handleBookingCancellation = async (
  bookingId: string
): Promise<string> => {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  const eventDate = new Date(booking.eventDate);
  const bookingDate = new Date(booking.bookingDate);

  const policy = getCancellationPolicy(bookingDate, eventDate);
  if (!policy.cancellable) {
    throw new Error(policy.reason || "Booking is not in a cancellable state");
  }

  const refundAmount = (booking.amount * policy.refundPercentage) / 100;

  await cancelBooking(bookingId);

  const wallet = await getWalletByUserId(booking.userId.toString());
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  await updateWallet(booking.userId.toString(), refundAmount);

  return `Booking cancelled. ${refundAmount} credited to wallet as per cancellation policy.`;
};

// Book a worker, deduct wallet balance, and mark the slot as unavailable
export const bookWorker = async (
  userId: string,
  workerId: string,
  slotId: string,
  amount: number
): Promise<IBooking> => {
  const userWallet = await findWalletByUserId(userId);
  if (!userWallet) {
    throw new Error("Wallet not found for this user");
  }

  if (userWallet.walletBalance < amount) {
    throw new Error("Insufficient wallet balance");
  }

  const newBalance = userWallet.walletBalance - amount;
  const transaction = {
    transactionDate: new Date(),
    transactionAmount: amount,
    transactionType: "debit" as "debit",
  };

  await updateWalletBalance(userId, newBalance, transaction);

  const slot = await Slot.findById(slotId);
  if (!slot) {
    throw new Error("Slot not found");
  }
  if (!slot.isAvailable) {
    throw new Error("Slot is already booked");
  }

  slot.isAvailable = false;
  await slot.save();

  const booking = new Booking({
    userId,
    slotId,
    workerId,
    amount,
    status: "Confirmed",
  });
  await booking.save();

  return booking;
};
