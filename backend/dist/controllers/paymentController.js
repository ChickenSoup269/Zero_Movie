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
exports.getPaymentHistory = exports.capturePayment = exports.createPayment = void 0;
const paymentServices_1 = require("../services/paymentServices");
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req.user.id;
        const { bookingId } = req.body;
        if (!bookingId) {
            res.status(400).json({ message: 'Thiếu bookingId' });
            return;
        }
        const { payment, orderId, approveUrl } = yield paymentServices_1.PaymentService.createPayment(bookingId, userId);
        res.status(201).json({
            message: 'Yêu cầu thanh toán đã được tạo',
            payment: {
                _id: payment._id.toString(),
                bookingId: payment.bookingId.toString(),
                userId: (_a = payment.userId) === null || _a === void 0 ? void 0 : _a.toString(),
                amount: payment.amount,
                status: payment.status,
            },
            orderId,
            approveUrl,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Lỗi khi tạo thanh toán' });
    }
});
exports.createPayment = createPayment;
const capturePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('PayPal redirect query:', req.query);
    try {
        const { token } = req.query; // PayPal gửi token thay vì orderId
        if (!token) {
            res.status(400).json({ message: 'Thiếu token từ PayPal' });
            return;
        }
        // Tìm payment trong DB bằng transactionId (orderId ban đầu)
        const payment = yield paymentServices_1.PaymentService.capturePaymentByOrderId(token);
        res.status(200).json({
            message: 'Thanh toán thành công',
            payment: {
                _id: payment._id.toString(),
                bookingId: payment.bookingId.toString(),
                userId: (_a = payment.userId) === null || _a === void 0 ? void 0 : _a.toString(),
                amount: payment.amount,
                status: payment.status,
                transactionId: payment.transactionId,
            },
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Lỗi khi xác nhận thanh toán' });
    }
});
exports.capturePayment = capturePayment;
const getPaymentHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id; // Lấy userId từ token
        const payments = yield paymentServices_1.PaymentService.getPaymentHistory(userId);
        res.status(200).json({
            message: payments.length ? 'Lấy lịch sử thanh toán thành công' : 'Không có lịch sử thanh toán',
            payments,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Lỗi khi lấy lịch sử thanh toán' });
    }
});
exports.getPaymentHistory = getPaymentHistory;
