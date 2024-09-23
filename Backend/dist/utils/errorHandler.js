"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};
exports.errorHandler = errorHandler;
