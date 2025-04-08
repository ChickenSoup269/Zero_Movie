"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const showtimeController_1 = require("../controllers/showtimeController");
const router = (0, express_1.Router)();
router.post('/', showtimeController_1.createShowtime);
router.get('/', showtimeController_1.getAllShowtimes);
router.get('/:id', showtimeController_1.getShowtimeById);
router.delete('/:id', showtimeController_1.deleteShowtime);
exports.default = router;
