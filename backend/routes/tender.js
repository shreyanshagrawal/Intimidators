import express from 'express';
import { getTenders, getTenderById, getDashboardStats } from '../controllers/tender.js';

const router = express.Router();

router.get('/', getTenders);
router.get('/stats', getDashboardStats);
router.get('/:id', getTenderById);

export default router;
