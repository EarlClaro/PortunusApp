import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';

const rounds = 10;

export async function register(req, res, next) {
  try {
    const { name, email, password} = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, rounds);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        position: null,
        contact: null,
        vesselId: null,
        role: 'COMPANY_EMPLOYEE',
      }
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, role: user.role}
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // Provide a default role if null
    const role = user.role ?? 'COMPANY_EMPLOYEE';

    const token = jwt.sign(
      { userId: user.id, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, role }
    });
    console.log('Attempting login for:', email);
    console.log('User from DB:', user);
    console.log('Password matches?', await bcrypt.compare(password, user.passwordHash));
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Incorrect old password' });

    const passwordHash = await bcrypt.hash(newPassword, rounds);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash}
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    next(error);
  }
}
