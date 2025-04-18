import { Router } from 'express';
import { createPayment, capturePayment, getPaymentHistory } from '../controllers/paymentController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
router.post('/create', authMiddleware, createPayment);
router.get('/success', capturePayment);
router.get('/history', authMiddleware, getPaymentHistory);

export default router;