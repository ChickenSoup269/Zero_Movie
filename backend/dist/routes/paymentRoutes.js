"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/create', auth_1.authMiddleware, paymentController_1.createPayment);
router.post('/capture', auth_1.authMiddleware, paymentController_1.capturePayment);
exports.default = router;
