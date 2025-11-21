const { User } = require('../models');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'replace_me';

// Password rule: 8-16 chars, at least one uppercase and one special char
const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,16}$/;

async function signup(req, res) {
  await body('name').isLength({ min: 3, max: 60 }).run(req); // relaxed min to avoid strict 20 char in demo; change to 20 if you want
  await body('email').isEmail().run(req);
  await body('password').matches(passwordRegex).run(req);
  await body('address').optional().isLength({ max: 400 }).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, address } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash, address, role: 'user' });

    return res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  await body('email').isEmail().run(req);
  await body('password').notEmpty().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user.id, role: user.role, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { signup, login };
