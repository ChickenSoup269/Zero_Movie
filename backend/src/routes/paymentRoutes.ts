import { Router } from 'express';
import { createPayment, capturePayment } from '../controllers/paymentController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/create', authMiddleware, createPayment);
router.post('/capture', authMiddleware, capturePayment);

export default router;