import { Router } from 'express';
import { createPayment, capturePayment} from '../controllers/paymentController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
router.post('/create', authMiddleware, createPayment);
router.get('/success', capturePayment);

export default router;