import { Router } from 'express';
import { register, login, refreshToken, logout, createGuestSession } from '../controllers/authController';

const router = Router();

router.post('/refresh', refreshToken);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/guestsession', createGuestSession);

export default router;