import { Response } from 'express';
import JournalEntry from '../models/JournalEntry';
import { AuthRequest } from '../types';

// Create journal entry
export const createEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, mood, tags } = req.body;
    const userId = req.user?.id;

    const entry = new JournalEntry({
      userId,
      title,
      content,
      mood,
      tags: tags || []
    });

    await entry.save();

    res.status(201).json({
      success: true,
      entry
    });
  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json({ message: 'Error creating journal entry' });
  }
};

// Get all entries
export const getEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;

    const entries = await JournalEntry.find({ userId })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await JournalEntry.countDocuments({ userId });

    res.json({
      success: true,
      entries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ message: 'Error fetching journal entries' });
  }
};

// Get single entry
export const getEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const entry = await JournalEntry.findOne({ _id: id, userId });

    if (!entry) {
      res.status(404).json({ message: 'Journal entry not found' });
      return;
    }

    res.json({
      success: true,
      entry
    });
  } catch (error) {
    console.error('Get journal entry error:', error);
    res.status(500).json({ message: 'Error fetching journal entry' });
  }
};

// Update entry
export const updateEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, mood, tags } = req.body;
    const userId = req.user?.id;

    const entry = await JournalEntry.findOneAndUpdate(
      { _id: id, userId },
      { title, content, mood, tags },
      { new: true, runValidators: true }
    );

    if (!entry) {
      res.status(404).json({ message: 'Journal entry not found' });
      return;
    }

    res.json({
      success: true,
      entry
    });
  } catch (error) {
    console.error('Update journal entry error:', error);
    res.status(500).json({ message: 'Error updating journal entry' });
  }
};

// Delete entry
export const deleteEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const entry = await JournalEntry.findOneAndDelete({ _id: id, userId });

    if (!entry) {
      res.status(404).json({ message: 'Journal entry not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Journal entry deleted'
    });
  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({ message: 'Error deleting journal entry' });
  }
};

export default { createEntry, getEntries, getEntry, updateEntry, deleteEntry };
