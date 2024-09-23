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
exports.updateSlotAvailability = exports.getSlotsByWorkerIdFromRepo = exports.findSlotByWorkerAndDate = exports.createSlot = void 0;
const slot_1 = require("../domain/slot");
// Function to create a slot
const createSlot = (slotData) => __awaiter(void 0, void 0, void 0, function* () {
    const slot = new slot_1.Slot(slotData);
    return yield slot.save();
});
exports.createSlot = createSlot;
// Function to find a slot by worker ID and date
const findSlotByWorkerAndDate = (workerId, date) => __awaiter(void 0, void 0, void 0, function* () {
    return slot_1.Slot.findOne({
        workerId,
        date: {
            $eq: date
        }
    }).exec();
});
exports.findSlotByWorkerAndDate = findSlotByWorkerAndDate;
// Function to get slots by worker ID
const getSlotsByWorkerIdFromRepo = (workerId) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return slot_1.Slot.find({
        workerId,
        date: { $gte: today },
    }).exec();
});
exports.getSlotsByWorkerIdFromRepo = getSlotsByWorkerIdFromRepo;
const updateSlotAvailability = (slotId, isAvailable) => __awaiter(void 0, void 0, void 0, function* () {
    yield slot_1.Slot.findByIdAndUpdate(slotId, { isAvailable }).exec();
});
exports.updateSlotAvailability = updateSlotAvailability;
