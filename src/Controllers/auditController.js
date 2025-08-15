import { prisma } from '../utils/prisma.js';

export async function createTemplate(req, res, next) {
  try {
    const { name, sections } = req.body; // sections = [{title, questions:[{text,type}]}]
    const t = await prisma.auditTemplate.create({
      data: { name, sections, createdBy: req.user.userId }
    });
    res.status(201).json(t);
  } catch (e) { next(e); }
}

export async function listTemplates(_req, res, next) {
  try {
    const items = await prisma.auditTemplate.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (e) { next(e); }
}

export async function startAudit(req, res, next) {
  try {
    const { templateId, vesselId } = req.body;
    const a = await prisma.auditInstance.create({
      data: {
        templateId, vesselId,
        startedById: req.user.userId,
        status: 'IN_PROGRESS'
      }
    });
    res.status(201).json(a);
  } catch (e) { next(e); }
}

export async function submitAudit(req, res, next) {
  try {
    const { id } = req.params;
    const { answers, reportUrl } = req.body;
    const updated = await prisma.auditInstance.update({
      where: { id },
      data: {
        answers,
        status: 'SUBMITTED',
        submittedAt: new Date(),
        reportUrl: reportUrl || null
      }
    });
    res.json(updated);
  } catch (e) { next(e); }
}

export async function listAudits(req, res, next) {
  try {
    const { vesselId, status } = req.query;
    const items = await prisma.auditInstance.findMany({
      where: {
        vesselId: vesselId || undefined,
        status: status || undefined
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (e) { next(e); }
}
