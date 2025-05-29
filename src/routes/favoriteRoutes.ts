import { Router } from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, addFavorite);          // add favorite
router.get('/', authMiddleware, getFavorites);          // get all favorites
router.delete('/:propertyId', authMiddleware, removeFavorite);  // remove favorite by custom id

export default router;
