import express from 'express';
import { login, getCurrentUser } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/user/:userId', getCurrentUser);

export default router;
