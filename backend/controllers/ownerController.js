// backend/controllers/ownerController.js
const { Store, Rating, User, Sequelize } = require('../models');
const { Op } = Sequelize;

// GET /api/owner/stores
// Return stores owned by the logged-in owner (or all for admin)
exports.getOwnerStores = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const where = isAdmin ? {} : { ownerId: userId };

    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
          attributes: ['id', 'rating']
        }
      ]
    });

    // compute quick stats per store (count & avg)
    const result = await Promise.all(stores.map(async s => {
      const ratings = s.Ratings || [];
      const count = ratings.length;
      const avg = count ? (ratings.reduce((a,b)=>a+b.rating,0) / count) : 0;
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        ownerId: s.ownerId,
        ratingsCount: count,
        averageRating: Number(avg.toFixed(2))
      };
    }));

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch owner stores' });
  }
};

// GET /api/owner/stores/:storeId/ratings
// Owner can see all ratings for a store they own (admin can see any)
exports.getRatingsForOwnerStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const storeId = req.params.storeId;

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    if (!isAdmin && store.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden — you do not own this store' });
    }

    const ratings = await Rating.findAll({
      where: { storeId },
      include: [{ model: User, attributes: ['id','name','email'] }],
      order: [['createdAt','DESC']]
    });

    return res.json(ratings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch ratings' });
  }
};

// GET /api/owner/stores/:storeId/average
// Return numeric average and count
exports.getAverageRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const storeId = req.params.storeId;

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    if (!isAdmin && store.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden — you do not own this store' });
    }

    const stats = await Rating.findOne({
      where: { storeId },
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'avg']
      ],
      raw: true
    });

    const count = Number(stats.count || 0);
    const avg = stats.avg ? Number(Number(stats.avg).toFixed(2)) : 0;

    return res.json({ storeId: Number(storeId), count, average: avg });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to compute average rating' });
  }
};
