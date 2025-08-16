import multer from 'multer';
import { randomUUID } from 'crypto';
import prisma from '../utils/prisma.js';
import { putBuffer, s3PublicUrl } from '../utils/s3.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });
export const uploadMiddleware = upload.single('file');

function computeStatus(expiryDate) {
  if (!expiryDate) return 'VALID';
  const now = new Date();
  const exp = new Date(expiryDate);
  const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'EXPIRED';
  if (diffDays <= 30) return 'EXPIRING';
  return 'VALID';
}

export async function createDocument(req, res, next) {
  try {
    const { ownerId, vesselId, type, issuer, issueDate, expiryDate, label } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Missing file' });

    const key = `docs/${ownerId || vesselId || 'general'}/${randomUUID()}_${req.file.originalname}`;
    await putBuffer({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    });

    const status = computeStatus(expiryDate);
    const doc = await prisma.document.create({
      data: {
        ownerId: ownerId || null,
        vesselId: vesselId || null,
        type, issuer,
        issueDate: issueDate ? new Date(issueDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        status,
        label: label || null,
        currentUrl: s3PublicUrl(key),
        versions: { create: { url: s3PublicUrl(key) } }
      },
      include: { versions: true }
    });

    res.status(201).json(doc);
  } catch (e) { next(e); }
}

export async function listDocuments(req, res, next) {
  try {
    const { ownerId, vesselId, type, status } = req.query;
    const docs = await prisma.document.findMany({
      where: {
        ownerId: ownerId || undefined,
        vesselId: vesselId || undefined,
        type: type || undefined,
        status: status || undefined
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(docs);
  } catch (e) { next(e); }
}

export async function reuploadVersion(req, res, next) {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ message: 'Missing file' });
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const key = `docs/${doc.ownerId || doc.vesselId || 'general'}/${randomUUID()}_${req.file.originalname}`;
    await putBuffer({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    });

    const newUrl = s3PublicUrl(key);
    const updated = await prisma.document.update({
      where: { id },
      data: {
        currentUrl: newUrl,
        versions: { create: { url: newUrl } }
      },
      include: { versions: true }
    });

    res.json(updated);
  } catch (e) { next(e); }
}

export async function updateDocumentMeta(req, res, next) {
  try {
    const { id } = req.params;
    const { type, issuer, issueDate, expiryDate, label } = req.body;
    const status = computeStatus(expiryDate);
    const updated = await prisma.document.update({
      where: { id },
      data: {
        type: type ?? undefined,
        issuer: issuer ?? undefined,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        label: label ?? undefined,
        status
      }
    });
    res.json(updated);
  } catch (e) { next(e); }
}
