import { Request, Response } from 'express';
import { stripe } from '../../Config/stripe'; 
import { updateBookingStatus } from '../../application/bookingService'; 
import { Slot } from '../../domain/slot'; 
import { ParsedQs } from 'qs'; 
import { Worker } from '../../domain/worker'; 


export const confirmPayment = async (req: Request, res: Response) => {
    try {
        const sessionId = req.query.session_id as string;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session.metadata) {
            return res.status(400).json({ error: 'Metadata is missing in the session' });
        }

        const bookingId = session.metadata.bookingId;

        if (session.payment_status === 'paid') {
            const booking = await updateBookingStatus(bookingId, 'Confirmed');

            if (booking) {
                await Slot.findByIdAndUpdate(booking.slotId, { isAvailable: false }).exec();
                
                const worker = await Worker.findById(booking.workerId).exec();

                if (!worker) {
                    return res.status(404).json({ error: 'Worker not found' });
                }

                console.log(`Booking ${bookingId} confirmed and slot ${booking.slotId} marked as unavailable.`);
                return res.status(200).json({
                    success: true,
                    worker: {
                        phoneNumber: worker.phoneNumber,
                        whatsappNumber: worker.whatsappNumber,
                    },
                });
            }
        } else {
            console.log(`Payment status for session ${sessionId}: ${session.payment_status}`);
            return res.status(400).json({ error: 'Payment failed or is pending' });
        }
    } catch (error: any) {
        console.error("Error confirming payment:", error);
        return res.status(400).json({ error: error.message });
    }
};