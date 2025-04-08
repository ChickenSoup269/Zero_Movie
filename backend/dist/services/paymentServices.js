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
const paymentModel_1 = __importDefault(require("../models/paymentModel"));
const bookingServices_1 = require("./bookingServices");
const paypal_1 = __importDefault(require("../config/paypal"));
const lib_1 = require("@paypal/checkout-server-sdk/lib/orders/lib");
const bookingModel_1 = __importDefault(require("../models/bookingModel"));
class PaymentService {
    static createPayment(bookingId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
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
                            currency_code: 'USD', // Đảm bảo dùng USD
                            value: (totalPrice / 23000).toFixed(2), // Quy đổi từ VND sang USD
                        },
                        description: `Thanh toán vé xem phim - Booking ID: ${bookingId}`,
                    }],
            });
            try {
                const order = yield paypal_1.default.execute(request);
                console.log('PayPal Order Created:', JSON.stringify(order.result, null, 2)); // Log chi tiết order
                payment.transactionId = order.result.id;
                yield payment.save();
                // Tìm link approve
                const approveLink = (_a = order.result.links.find((link) => link.rel === 'approve')) === null || _a === void 0 ? void 0 : _a.href;
                if (!approveLink)
                    throw new Error('Không tìm thấy approveUrl từ PayPal');
                return {
                    payment,
                    orderId: order.result.id,
                    approveUrl: approveLink,
                };
            }
            catch (error) {
                payment.status = 'failed';
                yield payment.save();
                console.error('Lỗi khi tạo thanh toán PayPal:', error.message);
                throw new Error('Không thể tạo thanh toán PayPal: ' + error.message);
            }
        });
    }
    static capturePayment(bookingId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Capture Payment - Booking ID:', bookingId);
            console.log('Capture Payment - Order ID:', orderId);
            const payment = yield paymentModel_1.default.findOne({ bookingId, transactionId: orderId });
            console.log('Capture Payment - Found Payment:', payment);
            if (!payment)
                throw new Error('Không tìm thấy Payment với bookingId hoặc orderId này');
            if (payment.status !== 'pending')
                throw new Error(`Payment đã ở trạng thái ${payment.status}`);
            const request = new lib_1.OrdersCaptureRequest(orderId);
            try {
                const capture = yield paypal_1.default.execute(request);
                console.log('Capture Payment - PayPal Response:', JSON.stringify(capture.result, null, 2)); // Log chi tiết capture
                // Kiểm tra trạng thái capture
                if (capture.result.status !== 'COMPLETED') {
                    payment.status = 'failed';
                    yield payment.save();
                    throw new Error('Thanh toán PayPal không hoàn tất, trạng thái: ' + capture.result.status);
                }
                payment.status = 'completed';
                payment.transactionId = capture.result.id;
                yield payment.save();
                // Chuyển ghế sang booked
                yield bookingServices_1.BookingService.confirmBooking(bookingId);
                console.log('Booking confirmed and seats booked for Booking ID:', bookingId);
                return payment;
            }
            catch (error) {
                payment.status = 'failed';
                yield payment.save();
                console.error('Lỗi khi capture thanh toán PayPal:', error.message);
                throw new Error('Thanh toán PayPal thất bại: ' + error.message);
            }
        });
    }
}
exports.PaymentService = PaymentService;
