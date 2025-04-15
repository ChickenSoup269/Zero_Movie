"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const paypal = __importStar(require("@paypal/checkout-server-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
// Khởi tạo môi trường Sandbox
const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);
// Hàm kiểm tra kết nối Sandbox
function verifySandboxConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, 'grant_type=client_credentials', {
                auth: {
                    username: process.env.PAYPAL_CLIENT_ID,
                    password: process.env.PAYPAL_SECRET,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            if (response.status === 200 && response.data.access_token) {
                console.log('Kết nối PayPal Sandbox thành công! Access token:', response.data.access_token);
                return true;
            }
            throw new Error('Phản hồi không hợp lệ từ PayPal');
        }
        catch (error) {
            console.error('Kết nối PayPal Sandbox thất bại:', error.message);
            if (axios_1.default.isAxiosError(error) && error.response) {
                console.error('Chi tiết lỗi:', error.response.data);
            }
            throw new Error('Không thể kết nối đến PayPal Sandbox');
        }
    });
}
// Kiểm tra kết nối khi server khởi động (chỉ trong môi trường dev)
if (process.env.NODE_ENV !== 'production') {
    verifySandboxConnection().catch(err => {
        console.error('Lỗi khởi tạo PayPal:', err.message);
        // Không thoát process để server vẫn chạy, nhưng báo lỗi rõ ràng
    });
}
exports.default = client;
