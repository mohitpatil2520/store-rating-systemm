const { Store, User, Rating } = require('../models');
const { body, validationResult } = require('express-validator');

// POST /api/stores (admin only)
exports.createStore = async (req, res) => {
  await body('name').notEmpty().isLength({ max: 255 }).run(req);
  await body('email').optional().isEmail().run(req);
  await body('address').optional().isLength({ max: 400 }).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, address, ownerId } = req.body;

  try {
    const store = await Store.create({ name, email, address, ownerId });
    return res.status(201).json(store);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to create store' });
  }
};

// GET /api/stores (public)
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    return res.json(stores);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch stores' });
  }
};

// GET /api/stores/:id (public)
exports.getStoreById = async (req, res) => {
  const { id } = req.params;

  try {
    const store = await Store.findByPk(id, {
      include: [{ model: Rating }]
    });

    if (!store) return res.status(404).json({ message: 'Store not found' });

    return res.json(store);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch store' });
  }
};
