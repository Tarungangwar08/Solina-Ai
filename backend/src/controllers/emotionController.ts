import { Response } from 'express';
import EmotionLog from '../models/EmotionLog';
import { AuthRequest } from '../types';

// Log a new mood entry
export const logMood = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mood, moodScore, note } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const emotionLog = await EmotionLog.create({
      userId,
      mood,
      moodScore,
      note
    });

    res.status(201).json({
      success: true,
      emotionLog
    });
  } catch (error) {
    console.error('Log mood error:', error);
    res.status(500).json({ message: 'Error logging mood' });
  }
};

// Get mood history
export const getMoodHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const moodHistory = await EmotionLog.findAll({
      where: {
        userId,
        createdAt: { $gte: startDate }
      },
      order: [['createdAt', 'DESC']]
    });

    // Calculate statistics
    const moodCounts: Record<string, number> = {};
    let totalScore = 0;

    moodHistory.forEach(log => {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
      totalScore += log.moodScore;
    });

    const averageScore = moodHistory.length > 0 
      ? (totalScore / moodHistory.length).toFixed(1) 
      : 0;

    // Get weekly data for chart
    const weeklyData = getWeeklyMoodData(moodHistory);

    res.json({
      success: true,
      moodHistory,
      statistics: {
        total: moodHistory.length,
        moodCounts,
        averageScore,
        weeklyData
      }
    });
  } catch (error) {
    console.error('Get mood history error:', error);
    res.status(500).json({ message: 'Error fetching mood history' });
  }
};

// Get today's mood
export const getTodayMood = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMood = await EmotionLog.findOne({
      where: {
        userId,
        createdAt: { $gte: today }
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      todayMood
    });
  } catch (error) {
    console.error('Get today mood error:', error);
    res.status(500).json({ message: 'Error fetching today\'s mood' });
  }
};

// Helper function to get weekly mood data
const getWeeklyMoodData = (moodHistory: any[]) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekData: { day: string; score: number; count: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = days[date.getDay()];
    
    const dayMoods = moodHistory.filter(log => {
      const logDate = new Date(log.createdAt);
      return logDate.toDateString() === date.toDateString();
    });

    const avgScore = dayMoods.length > 0
      ? dayMoods.reduce((sum, log) => sum + log.moodScore, 0) / dayMoods.length
      : 0;

    weekData.push({
      day: dayName,
      score: Number(avgScore.toFixed(1)),
      count: dayMoods.length
    });
  }

  return weekData;
};

export default { logMood, getMoodHistory, getTodayMood };