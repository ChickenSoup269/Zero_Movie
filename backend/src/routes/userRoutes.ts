import { Router } from 'express';
import { getProfile, updateProfile, deleteUser, getAllUsers, searchUsers } from '../controllers/userController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.delete('/:id', authMiddleware, deleteUser);        
router.get('/', authMiddleware, getAllUsers);           
router.get('/search', authMiddleware, searchUsers);   

export default router;