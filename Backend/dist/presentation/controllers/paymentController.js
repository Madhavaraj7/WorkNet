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
exports.confirmPayment = void 0;
const stripe_1 = require("../../Config/stripe");
const bookingService_1 = require("../../application/bookingService");
const slot_1 = require("../../domain/slot");
const worker_1 = require("../../domain/worker");
const confirmPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = req.query.session_id;
        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }
        const session = yield stripe_1.stripe.checkout.sessions.retrieve(sessionId);
        if (!session.metadata) {
            return res.status(400).json({ error: 'Metadata is missing in the session' });
        }
        const bookingId = session.metadata.bookingId;
        if (session.payment_status === 'paid') {
            const booking = yield (0, bookingService_1.updateBookingStatus)(bookingId, 'Confirmed');
            if (booking) {
                yield slot_1.Slot.findByIdAndUpdate(booking.slotId, { isAvailable: false }).exec();
                const worker = yield worker_1.Worker.findById(booking.workerId).exec();
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
        }
        else {
            console.log(`Payment status for session ${sessionId}: ${session.payment_status}`);
            return res.status(400).json({ error: 'Payment failed or is pending' });
        }
    }
    catch (error) {
        console.error("Error confirming payment:", error);
        return res.status(400).json({ error: error.message });
    }
});
exports.confirmPayment = confirmPayment;
