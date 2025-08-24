import * as paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// Khởi tạo môi trường Sandbox
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_SECRET!
);
const client = new paypal.core.PayPalHttpClient(environment);

// Hàm kiểm tra kết nối Sandbox
async function verifySandboxConnection() {
  try {
    const response = await axios.post(
      `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        auth: {
          username: process.env.PAYPAL_CLIENT_ID!,
          password: process.env.PAYPAL_SECRET!,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (response.status === 200 && response.data.access_token) {
      console.log('Kết nối PayPal Sandbox thành công! Access token:', response.data.access_token);
      return true;
    }
    throw new Error('Phản hồi không hợp lệ từ PayPal');
  } catch (error) {
    console.error('Kết nối PayPal Sandbox thất bại:', (error as Error).message);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Chi tiết lỗi:', error.response.data);
    }
    throw new Error('Không thể kết nối đến PayPal Sandbox');
  }
}

// Kiểm tra kết nối khi server khởi động (enviroment dev)
if (process.env.NODE_ENV !== 'production') {
  verifySandboxConnection().catch(err => {
    console.error('Lỗi khởi tạo PayPal:', err.message);
  });
}

export default client;