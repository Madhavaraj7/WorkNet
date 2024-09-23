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
exports.getAllWorkers = exports.updateWorkerByIdInDB = exports.findWorkerByIdInDB = exports.unblockWorker = exports.blockWorker = exports.getWorkerById = exports.findWorkerByUserIdInDB = exports.createWorker = void 0;
const worker_1 = require("../domain/worker");
const createWorker = (workerData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newWorker = new worker_1.Worker(workerData);
        return yield newWorker.save();
    }
    catch (err) {
        throw new Error('Error creating worker: ' + err.message);
    }
});
exports.createWorker = createWorker;
const findWorkerByUserIdInDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("hello iam");
    return yield worker_1.Worker.findOne({ userId });
});
exports.findWorkerByUserIdInDB = findWorkerByUserIdInDB;
const getWorkerById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield worker_1.Worker.findOne({ _id }).populate('categories');
});
exports.getWorkerById = getWorkerById;
const blockWorker = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield worker_1.Worker.findByIdAndUpdate(_id, { isBlocked: true }, { new: true });
});
exports.blockWorker = blockWorker;
const unblockWorker = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield worker_1.Worker.findByIdAndUpdate(_id, { isBlocked: false }, { new: true });
});
exports.unblockWorker = unblockWorker;
const findWorkerByIdInDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield worker_1.Worker.findById(userId);
});
exports.findWorkerByIdInDB = findWorkerByIdInDB;
const updateWorkerByIdInDB = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield worker_1.Worker.findOneAndUpdate({ userId }, updateData, { new: true });
});
exports.updateWorkerByIdInDB = updateWorkerByIdInDB;
// Worker Repository
const getAllWorkers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield worker_1.Worker.find({}).populate('categories', 'name description');
    }
    catch (err) {
        throw new Error('Error fetching workers from database: ' + err.message);
    }
});
exports.getAllWorkers = getAllWorkers;
