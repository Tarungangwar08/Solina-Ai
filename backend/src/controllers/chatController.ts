import { Response } from 'express';
import Conversation from '../models/Conversation';
import User from '../models/User';
import EmotionLog from '../models/EmotionLog';
import { AuthRequest } from '../types';
import { generateAIResponse, analyzeEmotion } from '../services/aiService';
import { detectCrisis, getCrisisResponse } from '../services/safetyService';

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
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get recent moods for context
    const recentMoods = await EmotionLog.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['mood']
    });

    let conversation;
    
    if (conversationId) {
      console.log(`Looking for conversation: ${conversationId} for user: ${userId}`);
      conversation = await Conversation.findOne({ where: { id: conversationId, userId } });
      if (conversation) {
        console.log(`Found existing conversation: ${conversation.id}`);
      } else {
        console.log(`Conversation not found, creating new one`);
      }
    }

    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: []
      });
      console.log(`Created new conversation: ${conversation.id}`);
    }

    // Add user message
    const updatedMessages = [...conversation.messages, {
      role: 'user' as const,
      content: message,
      createdAt: new Date()
    }];
    conversation.messages = updatedMessages;

    // Prepare messages for AI
    const aiMessages = conversation.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));

    // ===== Layer 1: Deterministic crisis detection =====
    // Runs BEFORE the LLM call so safety resources are guaranteed
    // even if the LLM has a bad day or is bypassed by prompt injection.
    const crisisResult = detectCrisis(message);

    let aiResponse: string;
    if (crisisResult.isCrisis) {
      console.log(`🚨 Crisis detected (${crisisResult.severity}) for user ${userId} — patterns: ${crisisResult.matchedPatterns.join(', ')}`);
      aiResponse = getCrisisResponse(crisisResult.severity);
    } else {
      // Normal flow — pass to LLM (which has Layer 2 system-prompt safety)
      aiResponse = await generateAIResponse(aiMessages, {
        name: user.name,
        recentMoods: recentMoods.map(m => m.mood)
      });
    }

    // Analyze emotion from user message
    const emotionAnalysis = analyzeEmotion(message);

    // Add AI response
    conversation.messages = [...conversation.messages, {
      role: 'assistant' as const,
      content: aiResponse,
      mood: emotionAnalysis.mood,
      createdAt: new Date()
    }];

    // Mark messages field as changed for Sequelize
    conversation.changed('messages', true);
    await conversation.save();

    res.json({
      success: true,
      conversation: {
        _id: conversation.id,
        id: conversation.id,
        title: conversation.title,
        messages: conversation.messages,
        userId: conversation.userId,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
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

    const conversations = await Conversation.findAll({
      where: { userId },
      order: [['updatedAt', 'DESC']],
      attributes: ['id', 'title', 'createdAt', 'updatedAt'],
      limit: 50
    });

    res.json({
      success: true,
      conversations: conversations.map(conv => ({
        _id: conv.id,
        id: conv.id,
        title: conv.title,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt
      }))
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

    const conversation = await Conversation.findOne({ where: { id, userId } });

    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    res.json({
      success: true,
      conversation: {
        _id: conversation.id,
        id: conversation.id,
        title: conversation.title,
        messages: conversation.messages,
        userId: conversation.userId,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      }
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

    const deleted = await Conversation.destroy({ where: { id, userId } });

    if (!deleted) {
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