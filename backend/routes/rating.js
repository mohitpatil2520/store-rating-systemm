const express = require('express');
const router = express.Router();

const { authenticateJWT } = require('../middleware/auth');
const { createOrUpdateRating, getRatingsForStore } = require('../controllers/ratingController');

// User adds/updates rating
router.post('/:id/ratings', authenticateJWT, createOrUpdateRating);

// Public: get all ratings for a store
router.get('/:id/ratings', getRatingsForStore);

module.exports = router;
