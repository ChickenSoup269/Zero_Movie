// src/utils/cronUtils.ts
import cron from 'node-cron';
import { ShowtimeSeatService } from '../services/showtimeseatServices';

export const startCronJobs = () => {
  cron.schedule('*/1 * * * *', async () => {
    try {
      console.log('Dọn dẹp ShowtimeSeat hết hạn...');
      await ShowtimeSeatService.cleanUpExpiredShowtimes(); // Gọi static method
    } catch (error) {
      console.error('Lỗi khi dọn dẹp ShowtimeSeat:', error);
    }
  });
};