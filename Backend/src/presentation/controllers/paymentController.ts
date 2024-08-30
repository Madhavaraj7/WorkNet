import { Request, Response } from 'express';
import { stripe } from '../../Config/stripe'; 
import { updateBookingStatus } from '../../application/bookingService'; 
import { Slot } from '../../domain/slot'; 
import { ParsedQs } from 'qs'; // Ensure this is imported for query parsing

export const confirmPayment = async (req: Request, res: Response) => {
    try {
        const sessionId = req.query.session_id as string;
        console.log(sessionId);
        

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
                console.log(`Booking ${bookingId} confirmed and slot ${booking.slotId} marked as unavailable.`);
            }

            res.status(200).json({ success: true });
        } else {
            console.log(`Payment status for session ${sessionId}: ${session.payment_status}`);
            res.status(400).json({ error: 'Payment failed or is pending' });
        }
    } catch (error: any) {
        console.error("Error confirming payment:", error);
        res.status(400).json({ error: error.message });
    }
};