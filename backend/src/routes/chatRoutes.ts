import { Router } from 'express';
import { sendMessage, getConversations, getConversation, deleteConversation } from '../controllers/chatController';
import { auth } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(auth);

// Route to send a message
router.post('/message', sendMessage);

// Route to get all conversations
router.get('/conversations', getConversations);

// Route to get a single conversation
router.get('/conversations/:id', getConversation);

// Route to delete a conversation
router.delete('/conversations/:id', deleteConversation);

export default router;