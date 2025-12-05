import { Router } from 'express';
import authRoutes from './authRoutes';
import chatRoutes from './chatRoutes';
import emotionRoutes from './emotionRoutes';
import userRoutes from './userRoutes';
import journalRoutes from './journalRoutes';
import goalRoutes from './goalRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/mood', emotionRoutes);
router.use('/user', userRoutes);
router.use('/journal', journalRoutes);
router.use('/goals', goalRoutes);

export default router;