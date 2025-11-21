const { Rating, Store, User } = require('../models');
const { body, validationResult } = require('express-validator');

// POST /api/stores/:id/ratings
exports.createOrUpdateRating = async (req, res) => {
  const storeId = req.params.id;
  const userId = req.user.id;

  // Validation
  await body('rating').isInt({ min: 1, max: 5 }).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { rating, comment } = req.body;

  try {
    const storeExists = await Store.findByPk(storeId);
    if (!storeExists) return res.status(404).json({ message: 'Store not found' });

    // Check if user already rated this store
    const existing = await Rating.findOne({ where: { userId, storeId } });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();

      return res.json({ message: "Rating updated", rating: existing });
    }

    // Create new rating
    const newRating = await Rating.create({
      rating,
      comment,
      storeId,
      userId
    });

    return res.status(201).json({ message: "Rating added", rating: newRating });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error processing rating" });
  }
};

// GET /api/stores/:id/ratings
exports.getRatingsForStore = async (req, res) => {
  const storeId = req.params.id;

  try {
    const ratings = await Rating.findAll({
      where: { storeId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    return res.json(ratings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch ratings" });
  }
};
