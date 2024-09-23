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
exports.bookWorker = exports.handleBookingCancellation = exports.updateBookingStatus = exports.createBooking = void 0;
const booking_1 = require("../domain/booking");
const slot_1 = require("../domain/slot");
const worker_1 = require("../domain/worker");
const bookingRepository_1 = require("../infrastructure/bookingRepository");
const walletRepository_1 = require("../infrastructure/walletRepository");
// Create a booking, check if the slot is available and worker exists
const createBooking = (userId, slotId, workerId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if slot is available
    const slot = yield slot_1.Slot.findById(slotId).exec();
    if (!slot || !slot.isAvailable) {
        throw new Error('Slot is not available');
    }
    // Check if worker exists
    const worker = yield worker_1.Worker.findById(workerId).exec();
    if (!worker) {
        throw new Error('Worker not found');
    }
    // Create the booking using the repository
    return (0, bookingRepository_1.createBooking)(userId, slotId, workerId, amount);
});
exports.createBooking = createBooking;
// Update the booking status (e.g. Confirm, Cancel)
const updateBookingStatus = (bookingId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_1.Booking.findByIdAndUpdate(bookingId, { status }, { new: true }).exec();
    // If confirmed, mark the slot as unavailable
    if (booking && status === 'Confirmed') {
        yield slot_1.Slot.findByIdAndUpdate(booking.slotId, { isAvailable: false }).exec();
    }
    return booking;
});
exports.updateBookingStatus = updateBookingStatus;
const getCancellationPolicy = (bookingDate, eventDate) => {
    const now = new Date();
    const hoursBeforeEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursBeforeEvent < 24) {
        return { refundPercentage: 0, cancellable: false, reason: 'Cancellation not allowed within 24 hours of the event' };
    }
    else if (hoursBeforeEvent < 48) {
        return { refundPercentage: 50, cancellable: true };
    }
    else {
        return { refundPercentage: 100, cancellable: true };
    }
};
const handleBookingCancellation = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the booking details
    const booking = yield (0, bookingRepository_1.getBookingById)(bookingId);
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
    yield (0, bookingRepository_1.cancelBooking)(bookingId);
    // Credit user's wallet with the refundable amount
    const wallet = yield (0, bookingRepository_1.getWalletByUserId)(booking.userId.toString());
    if (!wallet) {
        throw new Error('Wallet not found');
    }
    // Update the wallet with the refund amount
    yield (0, bookingRepository_1.updateWallet)(booking.userId.toString(), refundAmount);
    return `Booking cancelled. ${refundAmount} credited to wallet as per cancellation policy.`;
});
exports.handleBookingCancellation = handleBookingCancellation;
// Book a worker and deduct wallet balance
const bookWorker = (userId, workerId, slotId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    // Find user's wallet
    const userWallet = yield (0, walletRepository_1.findWalletByUserId)(userId);
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
        transactionType: 'debit',
    };
    // Update wallet balance and add transaction
    yield (0, walletRepository_1.updateWalletBalance)(userId, newBalance, transaction);
    // Find and update the slot status
    const slot = yield slot_1.Slot.findById(slotId);
    if (!slot) {
        throw new Error('Slot not found');
    }
    if (!slot.isAvailable) {
        throw new Error('Slot is already booked');
    }
    // Mark the slot as unavailable
    slot.isAvailable = false;
    yield slot.save();
    // Create the booking with status set to "Confirmed"
    const booking = new booking_1.Booking({
        userId,
        slotId,
        workerId,
        amount,
        status: 'Confirmed', // Set status to "Confirmed"
    });
    yield booking.save();
    return booking;
});
exports.bookWorker = bookWorker;
