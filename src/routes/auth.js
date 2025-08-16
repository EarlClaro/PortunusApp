import express from 'express';
import { register, login, changePassword, me } from '../Controllers/authController.js';
import { authRequired } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', authRequired, changePassword);
router.get('/me', authRequired, me);

export default router;
