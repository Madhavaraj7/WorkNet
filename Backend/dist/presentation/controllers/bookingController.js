"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingController = exports.cancelBookingController = exports.createBooking = void 0;
const bookingService_1 = require("../../application/bookingService");
const stripe_1 = require("../../Config/stripe");
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const booking = yield (0, bookingService_1.createBooking)(userId, slotId, workerId, amount);
        console.log("Booking Created:", booking);
        // Create a Stripe Checkout session
        const session = yield stripe_1.stripe.checkout.sessions.create({
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
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
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
    }
    catch (error) {
        console.error("Error creating booking:", error);
        res.status(400).json({ error: error.message || 'An error occurred while creating the booking.' });
    }
});
exports.createBooking = createBooking;
const cancelBookingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookingId } = req.params;
        console.log({ bookingId });
        const message = yield (0, bookingService_1.handleBookingCancellation)(bookingId);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.cancelBookingController = cancelBookingController;
const createBookingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workerId, slotId, amount } = req.body;
    console.log({ workerId, slotId, amount });
    const userId = req.userId;
    try {
        const booking = yield (0, bookingService_1.bookWorker)(userId, workerId, slotId, amount);
        console.log("booki", booking);
        res.status(201).json(booking);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.createBookingController = createBookingController;
