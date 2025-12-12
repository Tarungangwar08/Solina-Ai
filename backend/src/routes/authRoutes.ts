import { Router } from 'express';
import { register, login, getMe, googleAuth } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for Google OAuth
router.post('/google', googleAuth);

// Route to get current user
router.get('/me', auth, getMe);

export default router;