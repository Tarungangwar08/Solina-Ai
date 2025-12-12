import { Response } from 'express';
import Goal from '../models/Goal';
import { AuthRequest } from '../types';

// Create goal
export const createGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, stressLevel, dueDate } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const goal = await Goal.create({
      userId,
      title,
      description,
      category,
      stressLevel,
      dueDate
    });

    res.status(201).json({
      success: true,
      goal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ message: 'Error creating goal' });
  }
};

// Get all goals
export const getGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { completed } = req.query;

    const query: any = { userId };
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    const goals = await Goal.findAll({
      where: query,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      goals
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ message: 'Error fetching goals' });
  }
};

// Update goal
export const updateGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, category, stressLevel, progress, dueDate, completed } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const [updated] = await Goal.update(
      { title, description, category, stressLevel, progress, dueDate, completed },
      { where: { id, userId } }
    );

    if (!updated) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }

    const goal = await Goal.findOne({ where: { id, userId } });

    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }

    res.json({
      success: true,
      goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ message: 'Error updating goal' });
  }
};

// Delete goal
export const deleteGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const deleted = await Goal.destroy({ where: { id, userId } });

    if (!deleted) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Goal deleted'
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ message: 'Error deleting goal' });
  }
};

export default { createGoal, getGoals, updateGoal, deleteGoal };
