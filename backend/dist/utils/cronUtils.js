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
exports.startCronJobs = void 0;
// src/utils/cronUtils.ts
const node_cron_1 = __importDefault(require("node-cron"));
const showtimeseatServices_1 = require("../services/showtimeseatServices");
const startCronJobs = () => {
    node_cron_1.default.schedule('*/1 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Dọn dẹp ShowtimeSeat hết hạn...');
            yield showtimeseatServices_1.ShowtimeSeatService.cleanUpExpiredShowtimes(); // Gọi static method
        }
        catch (error) {
            console.error('Lỗi khi dọn dẹp ShowtimeSeat:', error);
        }
    }));
};
exports.startCronJobs = startCronJobs;
