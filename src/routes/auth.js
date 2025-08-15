import { Router } from 'express';
import { register, login, me } from '../Controllers/authController.js';
import { authRequired } from '../middlewares/authMiddleware.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';

const router = Router();

// HR Admin & Company Admin can create users
router.post('/register', authRequired, allowRoles('COMPANY_ADMIN', 'HR_ADMIN', 'CAPTAIN'), register);
router.post('/login', login);
router.get('/me', authRequired, me);

export default router;
