"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const allRoutes_1 = __importDefault(require("./presentation/routes/allRoutes"));
const config_1 = require("./config");
const morgan_1 = __importDefault(require("morgan"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const chat_1 = require("./presentation/socket/chat");
const dotenv_1 = __importDefault(require("dotenv"));
// import path from 'path';
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
// Middleware setup
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || '*',
}));
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json());
// Routes setup
app.use('/api/users', allRoutes_1.default);
// Connect to the database
(0, config_1.connectToDatabase)();
// Create an HTTP server
const httpServer = (0, http_1.createServer)(app);
// Initialize Socket.IO
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST'],
    },
});
// Use Socket.IO handler
(0, chat_1.socketHandler)(exports.io);
// // Serve static files in production
// if (process.env.NODE_ENV === 'production') {
//   // Correct path to the Frontend build folder
//   app.use(express.static(path.join(__dirname, '../../Frontend/build')));
//   // All other routes serve the React app
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../../Frontend', 'build', 'index.html'));
//   });
// }
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
