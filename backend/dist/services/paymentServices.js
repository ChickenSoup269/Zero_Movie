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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paymentModel_1 = __importDefault(require("../models/paymentModel"));
const bookingServices_1 = require("./bookingServices");
const paypal_1 = __importDefault(require("../config/paypal"));
const lib_1 = require("@paypal/checkout-server-sdk/lib/orders/lib");
const bookingModel_1 = __importDefault(require("../models/bookingModel"));
class PaymentService {
    static createPayment(bookingId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!mongoose_1.default.Types.ObjectId.isValid(bookingId))
                throw new Error('Booking ID không hợp lệ');
            const booking = yield bookingModel_1.default.findById(bookingId);
            if (!booking || booking.status !== 'pending')
                throw new Error('Booking không hợp lệ');
            const totalPrice = booking.totalPrice;
            if (!totalPrice || totalPrice <= 0)
                throw new Error('Tổng giá không hợp lệ');
            const payment = new paymentModel_1.default({
                bookingId,
                userId,
                amount: totalPrice,
                paymentMethod: 'paypal',
                status: 'pending',
            });
            yield payment.save();
            const request = new lib_1.OrdersCreateRequest();
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [{
                        amount: {
                            currency_code: 'AUD',
                            value: (totalPrice / 16000).toFixed(2),
                        },
                        description: `Thanh toán vé xem phim - Booking ID: ${bookingId}`,
                    }],
                application_context: {
                    return_url: 'http://localhost:3001/api/payments/success',
                    cancel_url: 'http://localhost:3001/api/payments/cancel',
                },
            });
            try {
                const order = yield paypal_1.default.execute(request);
                payment.transactionId = order.result.id;
                yield payment.save();
                const approveLink = (_a = order.result.links.find((link) => link.rel === 'approve')) === null || _a === void 0 ? void 0 : _a.href;
                if (!approveLink)
                    throw new Error('Không tìm thấy approveUrl từ PayPal');
                return { payment, orderId: order.result.id, approveUrl: approveLink };
            }
            catch (error) {
                payment.status = 'failed';
                yield payment.save();
                throw new Error(`Tạo thanh toán thất bại: ${error.message}`);
            }
        });
    }
    static capturePayment(bookingId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(bookingId))
                throw new Error('Booking ID không hợp lệ');
            const payment = yield paymentModel_1.default.findOne({ bookingId, transactionId: orderId });
            if (!payment || payment.status !== 'pending')
                throw new Error('Payment không hợp lệ');
            const request = new lib_1.OrdersCaptureRequest(orderId);
            try {
                const capture = yield paypal_1.default.execute(request);
                if (capture.result.status !== 'COMPLETED') {
                    payment.status = 'failed';
                    yield payment.save();
                    throw new Error('Thanh toán PayPal không hoàn tất');
                }
                payment.status = 'completed';
                payment.transactionId = capture.result.id;
                yield payment.save();
                yield bookingServices_1.BookingService.confirmBooking(bookingId);
                return payment;
            }
            catch (error) {
                payment.status = 'failed';
                yield payment.save();
                throw new Error(`Capture thanh toán thất bại: ${error.message}`);
            }
        });
    }
    static capturePaymentByOrderId(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield paymentModel_1.default.findOne({ transactionId: orderId });
            if (!payment || payment.status !== 'pending')
                throw new Error('Payment không hợp lệ');
            const request = new lib_1.OrdersCaptureRequest(orderId);
            try {
                const capture = yield paypal_1.default.execute(request);
                if (capture.result.status !== 'COMPLETED') {
                    payment.status = 'failed';
                    yield payment.save();
                    throw new Error('Thanh toán PayPal không hoàn tất');
                }
                payment.status = 'completed';
                payment.transactionId = capture.result.id;
                yield payment.save();
                yield bookingServices_1.BookingService.confirmBooking(payment.bookingId.toString());
                return payment;
            }
            catch (error) {
                payment.status = 'failed';
                yield payment.save();
                throw new Error(`Capture thanh toán thất bại: ${error.message}`);
            }
        });
    }
    static getPaymentHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(userId))
                throw new Error('User ID không hợp lệ');
            const payments = yield paymentModel_1.default.find({ userId })
                .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo, mới nhất trước
                .lean();
            if (!payments.length) {
                return [];
            }
            return payments.map(payment => ({
                _id: payment._id.toString(),
                bookingId: payment.bookingId.toString(),
                amount: payment.amount,
                status: payment.status,
                transactionId: payment.transactionId || null,
                paymentMethod: payment.paymentMethod,
                createdAt: payment.createdAt,
            }));
        });
    }
}
exports.PaymentService = PaymentService;
