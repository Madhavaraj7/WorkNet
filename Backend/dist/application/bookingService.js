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
// Create a new booking if the slot and worker are available
const createBooking = (userId, slotId, workerId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const slot = yield slot_1.Slot.findById(slotId).exec();
    if (!slot || !slot.isAvailable) {
        throw new Error("Slot is not available");
    }
    const worker = yield worker_1.Worker.findById(workerId).exec();
    if (!worker) {
        throw new Error("Worker not found");
    }
    return (0, bookingRepository_1.createBooking)(userId, slotId, workerId, amount);
});
exports.createBooking = createBooking;
// Update the booking status and mark the slot as unavailable if confirmed
const updateBookingStatus = (bookingId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_1.Booking.findByIdAndUpdate(bookingId, { status }, { new: true }).exec();
    if (booking && status === "Confirmed") {
        yield slot_1.Slot.findByIdAndUpdate(booking.slotId, { isAvailable: false }).exec();
    }
    return booking;
});
exports.updateBookingStatus = updateBookingStatus;
// Determine cancellation policy based on the time left before the event
const getCancellationPolicy = (bookingDate, eventDate) => {
    const now = new Date();
    const hoursBeforeEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursBeforeEvent < 24) {
        return {
            refundPercentage: 0,
            cancellable: false,
            reason: "Cancellation not allowed within 24 hours of the event",
        };
    }
    else if (hoursBeforeEvent < 48) {
        return { refundPercentage: 50, cancellable: true };
    }
    else {
        return { refundPercentage: 100, cancellable: true };
    }
};
// Cancel a booking and refund the user based on the cancellation policy
const handleBookingCancellation = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield (0, bookingRepository_1.getBookingById)(bookingId);
    if (!booking) {
        throw new Error("Booking not found");
    }
    const eventDate = new Date(booking.eventDate);
    const bookingDate = new Date(booking.bookingDate);
    const policy = getCancellationPolicy(bookingDate, eventDate);
    if (!policy.cancellable) {
        throw new Error(policy.reason || "Booking is not in a cancellable state");
    }
    const refundAmount = (booking.amount * policy.refundPercentage) / 100;
    yield (0, bookingRepository_1.cancelBooking)(bookingId);
    const wallet = yield (0, bookingRepository_1.getWalletByUserId)(booking.userId.toString());
    if (!wallet) {
        throw new Error("Wallet not found");
    }
    yield (0, bookingRepository_1.updateWallet)(booking.userId.toString(), refundAmount);
    return `Booking cancelled. ${refundAmount} credited to wallet as per cancellation policy.`;
});
exports.handleBookingCancellation = handleBookingCancellation;
// Book a worker, deduct wallet balance, and mark the slot as unavailable
const bookWorker = (userId, workerId, slotId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const userWallet = yield (0, walletRepository_1.findWalletByUserId)(userId);
    if (!userWallet) {
        throw new Error("Wallet not found for this user");
    }
    if (userWallet.walletBalance < amount) {
        throw new Error("Insufficient wallet balance");
    }
    const newBalance = userWallet.walletBalance - amount;
    const transaction = {
        transactionDate: new Date(),
        transactionAmount: amount,
        transactionType: "debit",
    };
    yield (0, walletRepository_1.updateWalletBalance)(userId, newBalance, transaction);
    const slot = yield slot_1.Slot.findById(slotId);
    if (!slot) {
        throw new Error("Slot not found");
    }
    if (!slot.isAvailable) {
        throw new Error("Slot is already booked");
    }
    slot.isAvailable = false;
    yield slot.save();
    const booking = new booking_1.Booking({
        userId,
        slotId,
        workerId,
        amount,
        status: "Confirmed",
    });
    yield booking.save();
    return booking;
});
exports.bookWorker = bookWorker;
