const express = require('express');
const router = express.Router();

const { createStore, getStores, getStoreById } = require('../controllers/storeController');
const { authenticateJWT, requireRole } = require('../middleware/auth');

// Admin can create store
router.post('/', authenticateJWT, requireRole('admin'), createStore);

// Public can view stores
router.get('/', getStores);

// Public can view single store
router.get('/:id', getStoreById);

module.exports = router;
