import { Booking, IBooking } from '../domain/booking'; 
import { Slot } from '../domain/slot'; 
import { Worker } from '../domain/worker'; 
import { 
  cancelBooking, 
  createBooking as createBookingRepo, 
  getBookingById, 
  getWalletByUserId, 
  updateWallet 
} from '../infrastructure/bookingRepository'; 
import { findWalletByUserId, updateWalletBalance } from '../infrastructure/walletRepository';



// Handle booking cancellation, credit the wallet
interface CancellationPolicy {
  refundPercentage: number;
  cancellable: boolean;
  reason?: string;
}

// Create a booking, check if the slot is available and worker exists
export const createBooking = async (userId: string, slotId: string, workerId: string, amount: number): Promise<IBooking> => {
  // Check if slot is available
  const slot = await Slot.findById(slotId).exec();
  if (!slot || !slot.isAvailable) {
    throw new Error('Slot is not available');
  }

  // Check if worker exists
  const worker = await Worker.findById(workerId).exec();
  if (!worker) {
    throw new Error('Worker not found');
  }

  // Create the booking using the repository
  return createBookingRepo(userId, slotId, workerId, amount);
};

// Update the booking status (e.g. Confirm, Cancel)
export const updateBookingStatus = async (bookingId: string, status: 'Pending' | 'Confirmed' | 'Cancelled'): Promise<IBooking | null> => {
  const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true }).exec();

  // If confirmed, mark the slot as unavailable
  if (booking && status === 'Confirmed') {
    await Slot.findByIdAndUpdate(booking.slotId, { isAvailable: false }).exec();
  }

  return booking;
};

const getCancellationPolicy = (bookingDate: Date, eventDate: Date): CancellationPolicy => {
  const now = new Date();
  const hoursBeforeEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursBeforeEvent < 24) {
    return { refundPercentage: 0, cancellable: false, reason: 'Cancellation not allowed within 24 hours of the event' };
  } else if (hoursBeforeEvent < 48) {
    return { refundPercentage: 50, cancellable: true }; // 50% refund for cancellations within 24-48 hours.
  } else {
    return { refundPercentage: 100, cancellable: true }; // Full refund for cancellations more than 48 hours in advance.
  }
};

export const handleBookingCancellation = async (bookingId: string): Promise<string> => {
  // Fetch the booking details
  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  const eventDate = new Date(booking.eventDate);
  const bookingDate = new Date(booking.bookingDate);

  const policy = getCancellationPolicy(bookingDate, eventDate);
  if (!policy.cancellable) {
    throw new Error(policy.reason || 'Booking is not in a cancellable state');
  }

  const refundAmount = (booking.amount * policy.refundPercentage) / 100;

  // Cancel the booking
  await cancelBooking(bookingId);

  // Credit user's wallet with the refundable amount
  const wallet = await getWalletByUserId(booking.userId.toString());
  if (!wallet) {
    throw new Error('Wallet not found');
  }

  // Update the wallet with the refund amount
  await updateWallet(booking.userId.toString(), refundAmount);

  return `Booking cancelled. ${refundAmount} credited to wallet as per cancellation policy.`;
};


// Book a worker and deduct wallet balance
export const bookWorker = async (userId: string, workerId: string, slotId: string, amount: number): Promise<IBooking> => {
  // Find user's wallet
  const userWallet = await findWalletByUserId(userId);
  if (!userWallet) {
    throw new Error('Wallet not found for this user');
  }

  // Check if wallet balance is sufficient
  if (userWallet.walletBalance < amount) {
    throw new Error('Insufficient wallet balance');
  }

  // Debit the wallet
  const newBalance = userWallet.walletBalance - amount;
  const transaction = {
    transactionDate: new Date(),
    transactionAmount: amount,
    transactionType: 'debit' as 'debit',
  };

  // Update wallet balance and add transaction
  await updateWalletBalance(userId, newBalance, transaction);

  // Find and update the slot status
  const slot = await Slot.findById(slotId);
  if (!slot) {
    throw new Error('Slot not found');
  }
  if (!slot.isAvailable) {
    throw new Error('Slot is already booked');
  }
  
  // Mark the slot as unavailable
  slot.isAvailable = false;
  await slot.save();

  // Create the booking with status set to "Confirmed"
  const booking = new Booking({
    userId,
    slotId,
    workerId,
    amount,
    status: 'Confirmed', // Set status to "Confirmed"
  });
  await booking.save();

  return booking;
};
