// infrastructure/bookingRepository.ts
import { Booking, IBooking } from '../domain/booking'; // Adjust the path as needed

export const createBooking = async (userId: string, slotId: string, workerId: string, amount: number): Promise<IBooking> => {
  const booking = new Booking({ userId, slotId, workerId, amount });
  return booking.save();
};
