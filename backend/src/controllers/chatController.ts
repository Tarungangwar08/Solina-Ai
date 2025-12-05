import { Response } from 'express';
import Conversation from '../models/Conversation';
import User from '../models/User';
import EmotionLog from '../models/EmotionLog';
import { AuthRequest } from '../types';
import { generateAIResponse, analyzeEmotion } from '../services/aiService';

// Send a message and get AI response
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get user info for context
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get recent moods for context
    const recentMoods = await EmotionLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('mood');

    let conversation;
    
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId });
    }

    if (!conversation) {
      conversation = new Conversation({
        userId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: []
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      createdAt: new Date()
    });

    // Prepare messages for AI
    const aiMessages = conversation.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));

    // Generate AI response
    const aiResponse = await generateAIResponse(aiMessages, {
      name: user.name,
      recentMoods: recentMoods.map(m => m.mood)
    });

    // Analyze emotion from user message
    const emotionAnalysis = analyzeEmotion(message);

    // Add AI response
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      mood: emotionAnalysis.mood,
      createdAt: new Date()
    });

    await conversation.save();

    res.json({
      success: true,
      conversation: {
        id: conversation._id,
        title: conversation.title,
        messages: conversation.messages
      },
      aiResponse,
      emotionAnalysis
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Error processing message' });
  }
};

// Get all conversations for a user
export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .select('title createdAt updatedAt')
      .limit(50);

    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

// Get a single conversation
export const getConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const conversation = await Conversation.findOne({ _id: id, userId });

    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    res.json({
      success: true,
      conversation
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Error fetching conversation' });
  }
};

// Delete a conversation
export const deleteConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const conversation = await Conversation.findOneAndDelete({ _id: id, userId });

    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Conversation deleted'
    });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ message: 'Error deleting conversation' });
  }
};

export default { sendMessage, getConversations, getConversation, deleteConversation };