import { prisma } from '../utils/prisma.js';

export async function createIncident(req, res, next) {
  try {
    const { vesselId, type, severity, description, location, occurredAt, attachments } = req.body;
    const i = await prisma.incident.create({
      data: {
        vesselId,
        createdById: req.user.userId,
        type,
        severity,
        description,
        location,
        occurredAt: new Date(occurredAt),
        attachments: attachments || null
      }
    });
    // TODO: notify admins/safety officer
    res.status(201).json(i);
  } catch (e) { next(e); }
}

export async function updateIncidentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body; // PENDING/IN_PROGRESS/RESOLVED/CLOSED
    const updated = await prisma.incident.update({ where: { id }, data: { status } });
    res.json(updated);
  } catch (e) { next(e); }
}

export async function listIncidents(req, res, next) {
  try {
    const { vesselId, severity, status } = req.query;
    const items = await prisma.incident.findMany({
      where: {
        vesselId: vesselId || undefined,
        severity: severity || undefined,
        status: status || undefined
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (e) { next(e); }
}
