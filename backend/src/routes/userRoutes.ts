import { Router } from 'express';
import { getProfile, updateProfile, updatePassword, uploadAvatar, deleteAvatar, deleteAccount } from '../controllers/userController';
import { auth } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const router = Router();

// Apply auth middleware to all routes
router.use(auth);

// Route to get user profile
router.get('/profile', getProfile);

// Route to update user profile
router.put('/profile', updateProfile);

// Route to update password
router.put('/password', updatePassword);

// Route to upload avatar
router.post('/avatar', upload.single('avatar'), uploadAvatar);

// Route to delete avatar
router.delete('/avatar', deleteAvatar);

// Route to delete account
router.delete('/account', deleteAccount);

export default router;
