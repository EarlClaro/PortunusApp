import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';

const rounds = Number(process.env.BCRYPT_ROUNDS || 10);

function sign(user) {
  return jwt.sign({ userId: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d'
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, role, position, contact, vesselId, password = 'password' } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, rounds);
    const user = await prisma.user.create({
      data: { name, email, role, position, contact, vesselId, passwordHash }
    });

    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = sign(user);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (e) { next(e); }
}

export async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (e) { next(e); }
}
