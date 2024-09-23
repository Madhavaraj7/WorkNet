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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSlotsByWorkerId = exports.createWorkerSlots = void 0;
const slotRepository_1 = require("../infrastructure/slotRepository");
const mongoose_1 = __importDefault(require("mongoose"));
const createWorkerSlots = (workerId, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const slots = [];
    const workerObjectId = new mongoose_1.default.Types.ObjectId(workerId);
    // Get today's date and set the time to 00:00:00 for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Ensure the startDate is at least tomorrow's date
    const start = new Date(startDate);
    if (start <= today) {
        throw new Error("Start date must be tomorrow or a future date.");
    }
    const end = new Date(endDate);
    const currentDate = new Date(start);
    while (currentDate <= end) {
        const existingSlot = yield (0, slotRepository_1.findSlotByWorkerAndDate)(workerObjectId, new Date(currentDate));
        if (existingSlot) {
            throw new Error(`Slot already exists for worker ${workerId} on ${currentDate.toDateString()}`);
        }
        const slot = yield (0, slotRepository_1.createSlot)({
            workerId: workerObjectId,
            date: new Date(currentDate),
            startDate: startDate,
            endDate: endDate
        });
        slots.push(slot);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return slots;
});
exports.createWorkerSlots = createWorkerSlots;
const getSlotsByWorkerId = (workerId) => __awaiter(void 0, void 0, void 0, function* () {
    const workerObjectId = new mongoose_1.default.Types.ObjectId(workerId);
    return yield (0, slotRepository_1.getSlotsByWorkerIdFromRepo)(workerObjectId);
});
exports.getSlotsByWorkerId = getSlotsByWorkerId;
