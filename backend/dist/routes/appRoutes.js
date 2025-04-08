"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupRoutes;
const moviesRoutes_1 = __importDefault(require("./moviesRoutes"));
const genresRoutes_1 = __importDefault(require("./genresRoutes"));
const cinemaRoutes_1 = __importDefault(require("./cinemaRoutes"));
const roomRoutes_1 = __importDefault(require("./roomRoutes"));
const seatRoutes_1 = __importDefault(require("./seatRoutes"));
const showtimeRoutes_1 = __importDefault(require("./showtimeRoutes"));
const showtimeseatRoutes_1 = __importDefault(require("./showtimeseatRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const bookingRoutes_1 = __importDefault(require("./bookingRoutes"));
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
function setupRoutes(app) {
    app.use("/api/auth", authRoutes_1.default);
    app.use("/api/users", userRoutes_1.default);
    app.use("/api/bookings", bookingRoutes_1.default);
    app.use("/api/payments", paymentRoutes_1.default);
    app.use("/api/cinemas", cinemaRoutes_1.default);
    app.use("/api/movies", moviesRoutes_1.default);
    app.use("/api/genres", genresRoutes_1.default);
    app.use("/api/room", roomRoutes_1.default);
    app.use("/api/seats", seatRoutes_1.default);
    app.use("/api/showtime", showtimeRoutes_1.default);
    app.use("/api/showtimeseat", showtimeseatRoutes_1.default);
}
