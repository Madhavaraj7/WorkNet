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
exports.getWorkerAppointmentsService = exports.getWorkerByIdService = exports.getAllWorkersService = exports.findWorkerById = exports.updateWorkerById = exports.getLoginedUserWorksService = exports.unblockWorkerService = exports.blockWorkerService = exports.findWorkerByUserId = exports.registerWorker = void 0;
const workerRepository_1 = require("../infrastructure/workerRepository");
const cloudinaryConfig_1 = require("../cloudinaryConfig");
const category_1 = require("../domain/category");
const userRepository_1 = require("../infrastructure/userRepository");
const worker_1 = require("../domain/worker");
const mongoose_1 = __importDefault(require("mongoose"));
const booking_1 = require("../domain/booking");
const slot_1 = require("../domain/slot");
// register a worker
const registerWorker = (workerData, files) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingWorker = yield worker_1.Worker.findOne({ userId: workerData.userId });
        if (existingWorker) {
            throw new Error('Worker already exists with this user ID');
        }
        // Check if the user is blocked
        const user = yield userRepository_1.UserModel.findById(workerData.userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.isBlocked) {
            throw new Error('User is blocked and cannot register as a worker');
        }
        // Handle registerImage upload
        let registerImageUrl = '';
        if (files.registerImage) {
            registerImageUrl = yield (0, cloudinaryConfig_1.uploadToCloudinary)(files.registerImage[0]);
        }
        // Handle workImages upload
        const workImageUrls = [];
        if (files.workImages) {
            const workImagePromises = files.workImages.map((file) => (0, cloudinaryConfig_1.uploadToCloudinary)(file));
            workImageUrls.push(...yield Promise.all(workImagePromises));
        }
        // Handle kycDetails upload
        const kycDetails = [];
        if (files.kycDocumentImage && workerData.kycDocumentType) {
            const documentImage = yield (0, cloudinaryConfig_1.uploadToCloudinary)(files.kycDocumentImage[0]);
            kycDetails.push({
                documentType: workerData.kycDocumentType,
                documentImage,
            });
        }
        // Handle categories
        let categoryIds = [];
        if (Array.isArray(workerData.categories)) {
            const isIdArray = workerData.categories.every((cat) => mongoose_1.default.Types.ObjectId.isValid(cat));
            if (isIdArray) {
                categoryIds = workerData.categories;
            }
            else {
                const categoryNames = workerData.categories;
                const categories = yield category_1.Category.find({ name: { $in: categoryNames } });
                categoryIds = categories.map(cat => cat._id.toString());
            }
        }
        else if (typeof workerData.categories === 'string') {
            const category = yield category_1.Category.findOne({ name: workerData.categories });
            if (category) {
                categoryIds = [category._id.toString()];
            }
            else {
                throw new Error(`Category not found with name: ${workerData.categories}`);
            }
        }
        // Validate category IDs
        const validCategoryIds = yield Promise.all(categoryIds.map((_id) => __awaiter(void 0, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(_id)) {
                throw new Error(`Invalid category ID: ${_id}`);
            }
            const category = yield category_1.Category.findById(_id);
            if (!category) {
                throw new Error(`Category not found with ID: ${_id}`);
            }
            return category._id.toString();
        })));
        // Create worker object
        const worker = Object.assign(Object.assign({}, workerData), { categories: validCategoryIds, registerImage: registerImageUrl, workImages: workImageUrls, kycDetails });
        const newWorker = yield (0, workerRepository_1.createWorker)(worker);
        yield userRepository_1.UserModel.updateOne({ _id: workerData.userId }, { $set: { role: 'pendingworker' } });
        return newWorker;
    }
    catch (err) {
        throw new Error('Error registering worker: ' + err.message);
    }
});
exports.registerWorker = registerWorker;
// find worker by using userID
const findWorkerByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const worker = yield (0, workerRepository_1.findWorkerByUserIdInDB)(userId);
        // console.log(worker);
        return worker;
    }
    catch (err) {
        throw new Error('Error finding worker: ' + err.message);
    }
});
exports.findWorkerByUserId = findWorkerByUserId;
// block the worker
const blockWorkerService = (workerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, workerRepository_1.blockWorker)(workerId);
});
exports.blockWorkerService = blockWorkerService;
// unblock the worker
const unblockWorkerService = (workerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, workerRepository_1.unblockWorker)(workerId);
});
exports.unblockWorkerService = unblockWorkerService;
// Get worker details by ID
const getLoginedUserWorksService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginedUserWorks = yield (0, workerRepository_1.findWorkerByUserIdInDB)(userId);
        // console.log("get login",loginedUserWorks);
        return loginedUserWorks;
    }
    catch (err) {
        throw new Error('Error fetching works: ' + err.message);
    }
});
exports.getLoginedUserWorksService = getLoginedUserWorksService;
// update the worker
const updateWorkerById = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedWorker = yield (0, workerRepository_1.updateWorkerByIdInDB)(userId, updateData);
        // console.log("updated",updatedWorker);
        return updatedWorker;
    }
    catch (err) {
        throw new Error('Error updating worker: ' + err.message);
    }
});
exports.updateWorkerById = updateWorkerById;
// find the worker
const findWorkerById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, workerRepository_1.findWorkerByIdInDB)(userId);
});
exports.findWorkerById = findWorkerById;
// get all workerService
const getAllWorkersService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workers = yield (0, workerRepository_1.getAllWorkers)();
        return workers;
    }
    catch (err) {
        throw new Error('Error fetching all workers: ' + err.message);
    }
});
exports.getAllWorkersService = getAllWorkersService;
// get workerId
const getWorkerByIdService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const worker = yield (0, workerRepository_1.getWorkerById)(userId);
        console.log(worker);
        return worker;
    }
    catch (err) {
        throw new Error('Error fetching worker by ID: ' + err.message);
    }
});
exports.getWorkerByIdService = getWorkerByIdService;
const getWorkerAppointmentsService = (workerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointments = yield booking_1.Booking.find({ workerId })
            .populate({
            path: 'userId',
            select: 'username',
            model: userRepository_1.UserModel
        })
            .populate({
            path: 'slotId',
            select: 'date',
            model: slot_1.Slot
        })
            .exec();
        const results = appointments.map(appointment => ({
            appointmentId: appointment._id,
            userName: appointment.userId.username,
            slotDate: appointment.slotId.date,
            amount: appointment.amount,
            status: appointment.status,
        }));
        return results;
    }
    catch (err) {
        throw new Error('Error fetching appointments: ' + err.message);
    }
});
exports.getWorkerAppointmentsService = getWorkerAppointmentsService;
