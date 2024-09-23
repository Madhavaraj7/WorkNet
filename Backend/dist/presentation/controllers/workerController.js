"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkerAppointmentsController = exports.getWorkerController = exports.updateWorkerController = exports.getLoginedUserWorksController = exports.unblockWorkerController = exports.blockWorkerController = exports.getWorkersController = exports.registerWorkerController = void 0;
const workerService_1 = require("../../application/workerService");
const cloudinaryConfig_1 = __importStar(require("../../cloudinaryConfig"));
const mongoose_1 = __importDefault(require("mongoose"));
const registerWorkerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workerData = req.body;
        const files = req.files;
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
        const existingWorker = yield (0, workerService_1.findWorkerByUserId)(userId);
        if (existingWorker) {
            return res.status(409).json({ message: "Worker already registered" });
        }
        const newWorker = yield (0, workerService_1.registerWorker)(Object.assign(Object.assign({}, workerData), { userId }), files);
        res.status(200).json(newWorker);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.registerWorkerController = registerWorkerController;
const getWorkersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workers = yield (0, workerService_1.getAllWorkersService)();
        res.status(200).json(workers);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getWorkersController = getWorkersController;
const blockWorkerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const blockedWorker = yield (0, workerService_1.blockWorkerService)(id);
        if (blockedWorker) {
            res
                .status(200)
                .json({
                message: "Worker blocked successfully",
                worker: blockedWorker,
            });
        }
        else {
            res.status(404).json({ message: "Worker not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.blockWorkerController = blockWorkerController;
const unblockWorkerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const unblockedWorker = yield (0, workerService_1.unblockWorkerService)(id);
        if (unblockedWorker) {
            res
                .status(200)
                .json({
                message: "Worker unblocked successfully",
                worker: unblockedWorker,
            });
        }
        else {
            res.status(404).json({ message: "Worker not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.unblockWorkerController = unblockWorkerController;
const getLoginedUserWorksController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    // console.log(userId,"get");
    try {
        const loginedUserWorks = yield (0, workerService_1.getLoginedUserWorksService)(userId);
        // console.log("con",loginedUserWorks);
        if (loginedUserWorks) {
            res.status(200).json(loginedUserWorks);
        }
        else {
            res
                .status(403)
                .json("You are not a worker. If you are a worker, please register!!");
        }
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
});
exports.getLoginedUserWorksController = getLoginedUserWorksController;
const updateWorkerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req.userId;
        let _b = req.body, { categories } = _b, workerData = __rest(_b, ["categories"]);
        console.log(Object.assign({ categories }, workerData));
        const files = req.files;
        console.log(files);
        if (!userId) {
            return res.status(401).json({ message: "User ID is required" });
        }
        const existingWorker = yield (0, workerService_1.findWorkerByUserId)(userId);
        if (!existingWorker) {
            return res.status(404).json({ message: "Worker not found" });
        }
        // Handle register image upload
        let registerImageUrl = existingWorker.registerImage;
        if ((_a = files.registerImage) === null || _a === void 0 ? void 0 : _a[0]) {
            if (registerImageUrl) {
                yield deleteFromCloudinary(registerImageUrl);
            }
            registerImageUrl = yield (0, cloudinaryConfig_1.uploadToCloudinary)(files.registerImage[0]);
        }
        // Handle work images upload
        const workImageUrls = [];
        if (files.workImages) {
            // Remove old work images if they exist
            for (const oldImageUrl of existingWorker.workImages) {
                yield deleteFromCloudinary(oldImageUrl);
            }
            // Upload new work images
            const workImagePromises = files.workImages.map((file) => (0, cloudinaryConfig_1.uploadToCloudinary)(file));
            workImageUrls.push(...(yield Promise.all(workImagePromises)));
        }
        else {
            // If no new work images are provided, keep the existing ones
            workImageUrls.push(...existingWorker.workImages);
        }
        // Handle and parse categories if provided
        if (categories) {
            // Ensure categories is an array
            if (typeof categories === "string") {
                try {
                    categories = JSON.parse(categories);
                }
                catch (err) {
                    return res.status(400).json({ message: "Invalid categories format" });
                }
            }
            // Verify that categories is an array
            if (!Array.isArray(categories)) {
                return res.status(400).json({ message: "Categories must be an array" });
            }
            // Convert each category to a valid ObjectId
            categories = categories.map((category) => {
                return new mongoose_1.default.Types.ObjectId(category); // Convert string to ObjectId
            });
        }
        else {
            // Default to existing categories if none provided
            categories = existingWorker.categories;
        }
        // Update worker data
        const updatedWorker = yield (0, workerService_1.updateWorkerById)(userId, Object.assign(Object.assign({}, workerData), { categories, registerImage: registerImageUrl, workImages: workImageUrls, status: "pending" }));
        res.status(200).json(updatedWorker);
    }
    catch (err) {
        console.error("Error:", err); // Log detailed error
        res.status(500).json({ message: err.message });
    }
});
exports.updateWorkerController = updateWorkerController;
const deleteFromCloudinary = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const publicId = (_a = imageUrl.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
    if (publicId) {
        yield cloudinaryConfig_1.default.uploader.destroy(publicId);
    }
});
const getWorkerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { wId } = req.params;
    console.log("hello", wId);
    try {
        const worker = yield (0, workerService_1.getWorkerByIdService)(wId);
        console.log("controller", worker);
        if (worker) {
            res.status(200).json(worker);
        }
        else {
            res.status(404).json({ message: "Worker not found" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getWorkerController = getWorkerController;
const getWorkerAppointmentsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const workerId = req.workerId;
    console.log(workerId);
    try {
        const users = yield (0, workerService_1.getWorkerAppointmentsService)(workerId);
        if (users.length > 0) {
            res.status(200).json(users);
        }
        else {
            res
                .status(404)
                .json({ message: "No appointments found for this worker" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getWorkerAppointmentsController = getWorkerAppointmentsController;
