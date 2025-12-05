import { Router } from 'express';
import { createEntry, getEntries, getEntry, updateEntry, deleteEntry } from '../controllers/journalController';
import { auth } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(auth);

// Route to create a journal entry
router.post('/', createEntry);

// Route to get all journal entries
router.get('/', getEntries);

// Route to get a single journal entry
router.get('/:id', getEntry);

// Route to update a journal entry
router.put('/:id', updateEntry);

// Route to delete a journal entry
router.delete('/:id', deleteEntry);

export default router;
