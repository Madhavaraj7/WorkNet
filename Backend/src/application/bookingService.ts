// application/bookingService.ts
import { Booking, IBooking } from '../domain/booking'; // Adjust the path as needed
import { Slot } from '../domain/slot'; // Adjust the path as needed
import { Worker } from '../domain/worker'; // Adjust the path as needed
import { createBooking as createBookingRepo } from '../infrastructure/bookingRepository'; // Adjust the path as needed

export const createBooking = async (userId: string, slotId: string, workerId: string, amount: number): Promise<IBooking> => {
  // Check if the slot is available
  const slot = await Slot.findById(slotId).exec();
  if (!slot || !slot.isAvailable) {
    throw new Error('Slot is not available');
  }

  // Check if the worker exists
  const worker = await Worker.findById(workerId).exec();
  if (!worker) {
    throw new Error('Worker not found');
  }

  // Create the booking
  return createBookingRepo(userId, slotId, workerId, amount);
};

// Optionally, add a function to update the booking status
export const updateBookingStatus = async (bookingId: string, status: 'Pending' | 'Confirmed' | 'Cancelled'): Promise<IBooking | null> => {
  const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true }).exec();

  if (booking && status === 'Confirmed') {
    // Mark the slot as unavailable
    await Slot.findByIdAndUpdate(booking.slotId, { isAvailable: false }).exec();
  }

  return booking;
};

