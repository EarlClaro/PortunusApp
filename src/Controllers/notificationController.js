import prisma from '../utils/prisma.js';

export async function listMyNotifications(req, res, next) {
  try {
    const items = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (e) { next(e); }
}

export async function markRead(req, res, next) {
  try {
    const { id } = req.params;
    const n = await prisma.notification.update({
      where: { id },
      data: { readAt: new Date() }
    });
    res.json(n);
  } catch (e) { next(e); }
}
