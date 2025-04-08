"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.capturePayment = exports.createPayment = void 0;
const paymentServices_1 = require("../services/paymentServices");
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
        const { bookingId } = req.body;
        const { payment, orderId, approveUrl } = yield paymentServices_1.PaymentService.createPayment(bookingId, userId);
        res.status(200).json({
            message: 'Yêu cầu thanh toán đã được tạo',
            payment,
            orderId,
            approveUrl, // Trả về link approve
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Lỗi khi tạo thanh toán' });
    }
});
exports.createPayment = createPayment;
const capturePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookingId, orderId } = req.body;
        const payment = yield paymentServices_1.PaymentService.capturePayment(bookingId, orderId);
        res.status(200).json({ message: 'Thanh toán thành công', payment });
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Lỗi khi xác nhận thanh toán' });
    }
});
exports.capturePayment = capturePayment;
