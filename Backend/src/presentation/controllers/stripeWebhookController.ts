// import { Request, Response } from 'express';
// import { stripe } from '../../Config/stripe';
// import { updateBookingStatus } from '../../application/bookingService';
// import { Slot } from '../../domain/slot';

// export const handleStripeWebhook = async (req: Request, res: Response) => {
//     console.log("kkkkkkkkkkkkkkkkkkkk");
    
//   const sig = req.headers['stripe-signature'] as string;

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_SECRET_KEY!);
//     console.log('Webhook Event:', event);
//   } catch (err: any) {
//     console.error(`⚠️  Webhook signature verification failed.`, err);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object as any;
//     const bookingId = session.metadata.bookingId;

//     console.log('Checkout Session Completed:', session);

//     try {
//       const booking = await updateBookingStatus(bookingId, 'Confirmed');
//       console.log("Booking Updated:", booking);

//       if (booking) {
//         await Slot.findByIdAndUpdate(booking.slotId, { isAvailable: false }).exec();
//         console.log(`Booking ${bookingId} confirmed and slot ${booking.slotId} marked as unavailable.`);
//       }

//     } catch (error: any) {
//       console.error(`Failed to update booking status or slot availability for booking ${bookingId}:`, error);
//       return res.status(500).send(`Server Error: ${error.message}`);
//     }
//   }

//   res.status(200).json({ received: true });
// };
