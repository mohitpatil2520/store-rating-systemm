// backend/routes/owner.js
const express = require('express');
const router = express.Router();
const { authenticateJWT, requireRole } = require('../middleware/auth');
const ownerCtrl = require('../controllers/ownerController');

// allow both 'owner' and 'admin'
const ownerOrAdmin = (req, res, next) => requireRole(['owner','admin'])(req, res, next);

// List stores for the logged-in owner (or all for admin)
router.get('/stores', authenticateJWT, ownerOrAdmin, ownerCtrl.getOwnerStores);

// Get all ratings for a store (owner must own the store)
router.get('/stores/:storeId/ratings', authenticateJWT, ownerOrAdmin, ownerCtrl.getRatingsForOwnerStore);

// Get average rating for a store
router.get('/stores/:storeId/average', authenticateJWT, ownerOrAdmin, ownerCtrl.getAverageRating);

module.exports = router;
