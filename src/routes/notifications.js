import { Router } from 'express';
import { authRequired } from '../middlewares/authMiddleware.js';
import { listMyNotifications, markRead } from '../Controllers/notificationController.js';

const router = Router();

router.get('/me', authRequired, listMyNotifications);
router.patch('/:id/read', authRequired, markRead);

export default router;
