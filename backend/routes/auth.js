const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();
const prisma = require('../lib/prisma');

/**
 * POST /api/auth/register
 * Body: { email, password, name, role? }
 * Creates a new user. Only SUPER_ADMIN can specify a role other than OPERATOR.
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Only allow valid roles; default to OPERATOR for safety
    const validRoles = ['SUPER_ADMIN', 'ADMIN', 'OPERATOR', 'VIEWER'];
    const assignedRole = (role && validRoles.includes(role)) ? role : 'OPERATOR';

    const user = await prisma.user.create({
      data: { email, passwordHash, name, role: assignedRole }
    });

    // Return JWT immediately on register
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    console.error('[Auth Register]', err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns signed JWT + user profile.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    console.error('[Auth Login]', err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

/**
 * GET /api/auth/me
 * Returns current user profile from the JWT.
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

/**
 * GET /api/auth/users
 * List all users — SUPER_ADMIN only.
 */
router.get('/users', authenticate, async (req, res) => {
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Only SUPER_ADMIN can view all users.' });
  }
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

/**
 * PATCH /api/auth/users/:id/role
 * Change a user's role — SUPER_ADMIN only.
 */
router.patch('/users/:id/role', authenticate, async (req, res) => {
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Only SUPER_ADMIN can change roles.' });
  }
  const { role } = req.body;
  const validRoles = ['SUPER_ADMIN', 'ADMIN', 'OPERATOR', 'VIEWER'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role.' });
  }
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, email: true, name: true, role: true }
    });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update role.' });
  }
});

module.exports = router;
