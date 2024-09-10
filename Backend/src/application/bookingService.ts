import { Booking, IBooking } from '../domain/booking'; 
import { Slot } from '../domain/slot'; 
import { Worker } from '../domain/worker'; 
import { 
  cancelBooking, 
  createBooking as createBookingRepo, 
  getWalletByUserId, 
  updateWallet 
} from '../infrastructure/bookingRepository'; 
import { findWalletByUserId, updateWalletBalance } from '../infrastructure/walletRepository';

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

// Handle booking cancellation, credit the wallet
export const handleBookingCancellation = async (bookingId: string): Promise<string> => {
  // Cancel the booking
  const booking = await cancelBooking(bookingId);
  if (!booking) {
    throw new Error('Booking not found or not in a cancellable state');
  }

  // Credit user's wallet
  const wallet = await getWalletByUserId(booking.userId.toString());
  if (!wallet) {
    throw new Error('Wallet not found');
  }

  // Update the wallet balance by crediting the amount back
  await updateWallet(booking.userId.toString(), wallet.walletBalance + booking.amount);

  return 'Booking cancelled and amount credited to wallet';
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
