"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.authMiddleware, bookingController_1.createBooking);
router.get('/my-bookings', auth_1.authMiddleware, bookingController_1.getUserBookings);
exports.default = router;
