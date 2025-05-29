import { Router } from 'express';
import { recommendProperty, getRecommendations } from '../controllers/recommendationController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, recommendProperty);
router.get('/', authMiddleware, getRecommendations);

export default router;