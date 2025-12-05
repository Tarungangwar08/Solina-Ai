import { Router } from 'express';
import { createGoal, getGoals, updateGoal, deleteGoal } from '../controllers/goalController';
import { auth } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(auth);

// Route to create a goal
router.post('/', createGoal);

// Route to get all goals
router.get('/', getGoals);

// Route to update a goal
router.put('/:id', updateGoal);

// Route to delete a goal
router.delete('/:id', deleteGoal);

export default router;
