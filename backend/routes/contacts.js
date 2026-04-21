const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = require('../lib/prisma');

/**
 * GET /api/contacts
 * Returns all contacts (leads) from DB.
 * Accessible by: SUPER_ADMIN, ADMIN, OPERATOR
 */
router.get('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'OPERATOR'), async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { messages: true } }
      }
    });
    res.json({ contacts });
  } catch (err) {
    console.error('[Contacts GET]', err);
    res.status(500).json({ error: 'Failed to fetch contacts.' });
  }
});

/**
 * GET /api/contacts/:id/messages
 * Returns conversation thread for a specific contact.
 * Accessible by: SUPER_ADMIN, ADMIN, OPERATOR
 */
router.get('/:id/messages', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'OPERATOR'), async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { contactId: req.params.id },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ messages });
  } catch (err) {
    console.error('[Messages GET]', err);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

module.exports = router;
