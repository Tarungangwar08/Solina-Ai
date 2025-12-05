import { Router } from 'express';
import { logMood, getMoodHistory, getTodayMood } from '../controllers/emotionController';
import { auth } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(auth);

// Route to log a new mood
router.post('/log', logMood);

// Route to get the mood history
router.get('/history', getMoodHistory);

// Route to get today's mood
router.get('/today', getTodayMood);

export default router;