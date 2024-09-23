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
exports.updateBookingStatus = exports.updateWallet = exports.getWalletByUserId = exports.getBookingById = exports.cancelBooking = exports.createBooking = void 0;
const booking_1 = require("../domain/booking");
const slot_1 = require("../domain/slot");
const wallet_1 = require("../domain/wallet");
const createBooking = (userId, slotId, workerId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = new booking_1.Booking({ userId, slotId, workerId, amount });
    return booking.save();
});
exports.createBooking = createBooking;
const cancelBooking = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield booking_1.Booking.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }
        booking.status = 'Cancelled';
        yield booking.save();
        const slot = yield slot_1.Slot.findById(booking.slotId);
        if (slot) {
            slot.isAvailable = true;
            yield slot.save();
        }
        else {
            throw new Error('Slot not found');
        }
        return booking;
    }
    catch (error) {
        console.error('Error cancelling the booking:', error);
        throw error;
    }
});
exports.cancelBooking = cancelBooking;
const getBookingById = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    return booking_1.Booking.findById(bookingId).exec();
});
exports.getBookingById = getBookingById;
const getWalletByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return wallet_1.WalletModel.findOne({ userId }).exec();
});
exports.getWalletByUserId = getWalletByUserId;
const updateWallet = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    return wallet_1.WalletModel.findOneAndUpdate({ userId }, {
        $inc: { walletBalance: amount },
        $push: {
            walletTransaction: {
                transactionDate: new Date(),
                transactionAmount: amount,
                transactionType: 'credit'
            }
        }
    }, { new: true }).exec();
});
exports.updateWallet = updateWallet;
const updateBookingStatus = (bookingId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield booking_1.Booking.findByIdAndUpdate(bookingId, { status }, { new: true, runValidators: true });
    }
    catch (error) {
        console.error("Error updating booking status:", error);
        throw new Error("Failed to update booking status");
    }
});
exports.updateBookingStatus = updateBookingStatus;
