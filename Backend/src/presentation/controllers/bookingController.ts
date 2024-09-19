import { Request, Response } from 'express';
import { bookWorker, createBooking as createBookingService, handleBookingCancellation } from '../../application/bookingService';
import { stripe } from '../../Config/stripe';
import { IBooking } from '../../domain/booking';

interface CustomRequest extends Request {
    userId?: string;
}

export const createBooking = async (req: CustomRequest, res: Response) => {
  try {
      const { slotId, workerId, amount, customerEmail, customerName, customerAddress } = req.body;
      const userId = req.userId;

      console.log("Request Body:", { slotId, workerId, amount, customerEmail, customerName, customerAddress });
      console.log("User ID:", userId);

      if (!userId) {
          console.error('User not authenticated');
          return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!slotId || !workerId || !amount || !customerEmail || !customerName || !customerAddress) {
          console.error('Missing required fields');
          return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create a booking in the database
      const booking = await createBookingService(userId, slotId, workerId, amount);
      console.log("Booking Created:", booking);

      // Create a Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
              price_data: {
                  currency: 'inr',
                  product_data: {
                      name: `Booking with Worker ${workerId}`,
                  },
                  unit_amount: amount * 100, 
              },
              quantity: 1,
          }],
          mode: 'payment',
          success_url: `https://work-net-seven.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}`, 
          cancel_url: `https://work-net-seven.vercel.app/cancel`,
          customer_email: customerEmail,
          shipping_address_collection: {
              allowed_countries: ['IN'],
          },
          metadata: {
              bookingId: String(booking._id),
              customerName: customerName,
              customerAddress: customerAddress,
            },
        });
        console.log(session.success_url);

      console.log("Stripe Session Created:", session);
      res.status(201).json({ sessionId: session.id });
  } catch (error: any) {
      console.error("Error creating booking:", error);
      res.status(400).json({ error: error.message || 'An error occurred while creating the booking.' });
  }
};




export const cancelBookingController = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId } = req.params;
      console.log({bookingId});
      
      const message = await handleBookingCancellation(bookingId);
      res.status(200).json({ message });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };



  export const createBookingController = async (req: any, res: Response) => {
    const {  workerId, slotId, amount } = req.body;

    console.log({workerId,slotId,amount});
    
    const userId = req.userId;

  
    try {
      const booking = await bookWorker(userId, workerId, slotId, amount);
      console.log("booki",booking);
      
      res.status(201).json(booking);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };