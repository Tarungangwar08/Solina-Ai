import { Router } from 'express';
import { getProfile, updateProfile, updatePassword, deleteAccount } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(auth);

// Route to get user profile
router.get('/profile', getProfile);

// Route to update user profile
router.put('/profile', updateProfile);

// Route to update password
router.put('/password', updatePassword);

// Route to delete account
router.delete('/account', deleteAccount);

export default router;
