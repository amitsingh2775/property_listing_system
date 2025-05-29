import { Request, Response } from 'express';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { AuthRequest } from '../middleware/authMiddleware';

export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { propertyId } = req.body;
    if (!propertyId) return res.status(400).json({ message: 'Property ID required' });

    
    const propertyExists = await Property.findOne({ id: propertyId });
    if (!propertyExists) return res.status(404).json({ message: 'Property not found' });

    if (!user.favorites.includes(propertyId)) {
      user.favorites.push(propertyId);
      await user.save();
    }
    res.json({ message: 'Property added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const properties = await Property.find({ id: { $in: user.favorites } });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const propertyIdToRemove = req.params.propertyId;
    user.favorites = user.favorites.filter(id => id !== propertyIdToRemove);
    await user.save();

    res.json({ message: 'Property removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
