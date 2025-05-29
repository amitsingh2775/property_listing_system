import { Router } from 'express';
import {  createProperty, getProperties, getProperty, updateProperty, deleteProperty } from '../controllers/propertyController';
import authMiddleware from '../middleware/authMiddleware';
import { cacheMiddleware } from '../utils/redisClient';

const router = Router();


router.post('/', authMiddleware, createProperty);
router.get('/', cacheMiddleware, getProperties);
router.get('/:id', cacheMiddleware, getProperty);
router.put('/:id', authMiddleware, updateProperty);
router.delete('/:id', authMiddleware, deleteProperty);

export default router;