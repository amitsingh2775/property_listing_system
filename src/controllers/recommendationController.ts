import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const recommendProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { email, propertyId } = req.body;
    const recipient = await User.findOne({ email });
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

    recipient.recommendations.push({
      propertyId: new mongoose.Types.ObjectId(propertyId),
      recommendedBy: new mongoose.Types.ObjectId(req.user!.userId),
      createdAt: new Date(),
    });
    await recipient.save();
    res.json({ message: 'Property recommended successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId).populate('recommendations.propertyId recommendations.recommendedBy');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};