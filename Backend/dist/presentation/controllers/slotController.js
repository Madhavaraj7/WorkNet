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
exports.getSlotsByWorkerController = exports.createSlotController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slotService_1 = require("../../application/slotService");
// Controller to create slots for a worker
const createSlotController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.body;
        if (!req.workerId || !startDate || !endDate) {
            return res.status(400).json({ message: "Invalid input data" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(req.workerId)) {
            return res.status(400).json({ message: "Invalid workerId format" });
        }
        const slots = yield (0, slotService_1.createWorkerSlots)(req.workerId, new Date(startDate), new Date(endDate));
        res.status(201).json(slots);
    }
    catch (error) {
        console.error("Error creating slots:", error);
        res
            .status(500)
            .json({ message: "Error creating slots", error: error.message });
    }
});
exports.createSlotController = createSlotController;
// Controller to fetch slots for a specific worker
const getSlotsByWorkerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workerId = req.workerId;
        if (!workerId || !mongoose_1.default.Types.ObjectId.isValid(workerId)) {
            return res.status(400).json({ message: "Invalid workerId format" });
        }
        const slots = yield (0, slotService_1.getSlotsByWorkerId)(workerId);
        res.status(200).json(slots);
    }
    catch (error) {
        console.error("Error fetching slots:", error);
        res
            .status(500)
            .json({ message: "Error fetching slots", error: error.message });
    }
});
exports.getSlotsByWorkerController = getSlotsByWorkerController;
