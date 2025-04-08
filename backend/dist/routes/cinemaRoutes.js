"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cinemaController_1 = require("../controllers/cinemaController");
const router = (0, express_1.Router)();
//routes
router.get('/', cinemaController_1.getAllCinemas);
router.get('/:id', cinemaController_1.getCinemaById);
router.get('/:id/showtimes', cinemaController_1.getShowtimesByCinemaId); // showtime by cinema
router.post('/', cinemaController_1.createCinema);
router.put('/:id', cinemaController_1.updateCinema);
router.delete('/:id', cinemaController_1.deleteCinema);
exports.default = router;
