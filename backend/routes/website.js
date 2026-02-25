import express from 'express';
import { getWebsites, getWebsiteById, getDashboardStats } from '../controllers/website.js';

const router = express.Router();

router.get('/', getWebsites);
router.get('/stats', getDashboardStats);
router.get('/:id', getWebsiteById);

export default router;
