import { Router } from 'express';
import { register, login, refreshToken, logout, createGuestSession, forgotPassword, resetPassword} from '../controllers/authController';

const router = Router();

router.post('/refresh', refreshToken);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/guestsession', createGuestSession);
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password', resetPassword);
export default router;