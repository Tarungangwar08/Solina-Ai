import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types';
import fs from 'fs';
import path from 'path';

// Get user profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.user?.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, ageGroup, language, avatar } = req.body;

    const [updated] = await User.update(
      { name, ageGroup, language, avatar },
      { where: { id: req.user?.id } }
    );

    if (!updated) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const user = await User.findByPk(req.user?.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Update password
export const updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user?.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
};

// Upload avatar
export const uploadAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Delete old avatar if exists
    const user = await User.findByPk(req.user?.id);
    if (user?.avatar) {
      const oldPath = path.join(__dirname, '../../', user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update user avatar
    await User.update({ avatar: avatarUrl }, { where: { id: req.user?.id } });

    const updatedUser = await User.findByPk(req.user?.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      avatar: avatarUrl,
      user: updatedUser
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Error uploading avatar' });
  }
};

// Delete avatar
export const deleteAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.user?.id);
    
    if (user?.avatar) {
      const filePath = path.join(__dirname, '../../', user.avatar);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      await User.update({ avatar: undefined }, { where: { id: req.user?.id } });
    }

    const updatedUser = await User.findByPk(req.user?.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({ message: 'Error deleting avatar' });
  }
};

// Delete account
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await User.destroy({ where: { id: req.user?.id } });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Error deleting account' });
  }
};

export default { getProfile, updateProfile, updatePassword, uploadAvatar, deleteAvatar, deleteAccount };