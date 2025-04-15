"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seatController_1 = require("../controllers/seatController");
const router = (0, express_1.Router)();
router.get('/room/:roomId', seatController_1.SeatController.getSeatsByRoom);
router.get('/:id', seatController_1.SeatController.getSeatById);
router.delete('/:id', seatController_1.SeatController.deleteSeat);
exports.default = router;
