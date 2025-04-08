"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const showtimeseatController_1 = require("../controllers/showtimeseatController");
const router = (0, express_1.Router)();
// Lấy danh sách ghế theo suất chiếu
router.get('/showtime/:showtimeId', showtimeseatController_1.getSeatsByShowtime);
router.put('/showtime/:showtimeId/seat/:seatId', showtimeseatController_1.updateSeatStatus);
exports.default = router;
