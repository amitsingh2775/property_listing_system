import { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import axios from 'axios';
import { Property } from '../models/Property';
import { AuthRequest } from '../middleware/authMiddleware';
import { clearCache } from '../utils/redisClient';


import redisClient from '../utils/redisClient';

export const createProperty = [
  body('id').isString().notEmpty().withMessage('Property ID is required'),
  body('title').isString().notEmpty().withMessage('Title is required'),
  body('type').isString().notEmpty().withMessage('Type is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('state').isString().notEmpty().withMessage('State is required'),
  body('city').isString().notEmpty().withMessage('City is required'),
  body('areaSqFt').isFloat({ min: 0 }).withMessage('Area must be a positive number'),
  body('bedrooms').isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative integer'),
  body('bathrooms').isInt({ min: 0 }).withMessage('Bathrooms must be a non-negative integer'),
  body('amenities').isArray().optional().withMessage('Amenities must be an array'),
  body('furnished').isString().optional().withMessage('Furnished status must be a string'),
  body('availableFrom').isISO8601().toDate().withMessage('Available from must be a valid date'),
  body('listedBy').isString().notEmpty().withMessage('Listed by is required'),
  body('tags').isArray().optional().withMessage('Tags must be an array'),
  body('colorTheme').isString().optional().withMessage('Color theme must be a string'),
  body('rating').isFloat({ min: 0, max: 5 }).optional().withMessage('Rating must be between 0 and 5'),
  body('isVerified').isBoolean().optional().withMessage('isVerified must be a boolean'),
  body('listingType').isIn(['rent', 'sale']).withMessage('Listing type must be rent or sale'),
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const property = new Property({ ...req.body, createdBy: req.user!.userId });
      await property.save();
      await clearCache('properties:*');
      res.status(201).json(property);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },
];

export const getProperty = [
  param('id').isMongoId().withMessage('Invalid property ID'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const key = `property:${req.params.id}`;
    try {
      const cached = await redisClient.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const property = await Property.findById(req.params.id);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      await redisClient.setex(key, 3600, JSON.stringify(property));
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },
];

export const getProperties = [
  query('priceMin').optional().isFloat({ min: 0 }).withMessage('Price min must be a positive number'),
  query('priceMax').optional().isFloat({ min: 0 }).withMessage('Price max must be a positive number'),
  query('bedrooms').optional().isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative integer'),
  query('bathrooms').optional().isInt({ min: 0 }).withMessage('Bathrooms must be a non-negative integer'),
  query('areaMin').optional().isFloat({ min: 0 }).withMessage('Area min must be a positive number'),
  query('areaMax').optional().isFloat({ min: 0 }).withMessage('Area max must be a positive number'),
  query('title').optional().isString().withMessage('Title must be a string'),
  async (req: Request, res: Response) => {
    try {
      const query: any = {};

     
      if (req.query.priceMin || req.query.priceMax) {
        query.price = {};
        if (req.query.priceMin) query.price.$gte = parseFloat(req.query.priceMin as string);
        if (req.query.priceMax) query.price.$lte = parseFloat(req.query.priceMax as string);
      }
      if (req.query.areaMin || req.query.areaMax) {
        query.areaSqFt = {};
        if (req.query.areaMin) query.areaSqFt.$gte = parseFloat(req.query.areaMin as string);
        if (req.query.areaMax) query.areaSqFt.$lte = parseFloat(req.query.areaMax as string);
      }

      // Exact matches
      if (req.query.bedrooms) query.bedrooms = parseInt(req.query.bedrooms as string);
      if (req.query.bathrooms) query.bathrooms = parseInt(req.query.bathrooms as string);
      if (req.query.type) query.type = new RegExp(req.query.type as string, 'i');
      if (req.query.state) query.state = new RegExp(req.query.state as string, 'i');
      if (req.query.city) query.city = new RegExp(req.query.city as string, 'i');
      if (req.query.listingType) query.listingType = req.query.listingType;
      if (req.query.furnished) query.furnished = new RegExp(req.query.furnished as string, 'i');
      if (req.query.listedBy) query.listedBy = new RegExp(req.query.listedBy as string, 'i');
      if (req.query.rating) query.rating = { $gte: parseFloat(req.query.rating as string) };
      if (req.query.isVerified) query.isVerified = req.query.isVerified === 'true';
      if (req.query.amenities) query.amenities = { $all: (req.query.amenities as string).split(',') };
      if (req.query.tags) query.tags = { $all: (req.query.tags as string).split(',') };
      if (req.query.title) query.title = new RegExp(req.query.title as string, 'i');

      const properties = await Property.find(query);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },
];

export const updateProperty = [
  param('id').isMongoId().withMessage('Invalid property ID'),
  body('title').optional().isString().notEmpty().withMessage('Title must be a non-empty string'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('areaSqFt').optional().isFloat({ min: 0 }).withMessage('Area must be a positive number'),
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const property = await Property.findOne({ _id: req.params.id, createdBy: req.user!.userId });
      if (!property) return res.status(403).json({ message: 'Unauthorized or property not found' });

      Object.assign(property, req.body);
      await property.save();
      await clearCache(`property:${req.params.id}`);
      await clearCache('properties:*');
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },
];

export const deleteProperty = [
  param('id').isMongoId().withMessage('Invalid property ID'),
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const property = await Property.findOneAndDelete({ _id: req.params.id, createdBy: req.user!.userId });
      if (!property) return res.status(403).json({ message: 'Unauthorized or property not found' });

      await clearCache(`property:${req.params.id}`);
      await clearCache('properties:*');
      res.json({ message: 'Property deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },
];