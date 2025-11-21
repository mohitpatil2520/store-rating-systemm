// backend/controllers/adminController.js
const { User, Store, Rating, Sequelize } = require('../models');
const { Op } = Sequelize;
const bcrypt = require('bcryptjs');

// ---------- Users ----------
// POST /api/admin/users  (create user)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role = 'user' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash, address, role });
    return res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/users  (list users with optional filters)
exports.listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', role } = req.query;
    const where = {};
    if (search) where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } }
    ];
    if (role) where.role = role;

    const users = await User.findAndCountAll({
      where,
      attributes: ['id','name','email','role','address','createdAt'],
      limit: parseInt(limit),
      offset: (parseInt(page)-1) * parseInt(limit),
      order: [['createdAt','DESC']]
    });

    return res.json({ total: users.count, page: parseInt(page), perPage: parseInt(limit), data: users.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to list users' });
  }
};

// PUT /api/admin/users/:id  (update user: name, address, role)
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, address, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name ?? user.name;
    user.address = address ?? user.address;
    if (role) user.role = role;
    await user.save();
    return res.json({ message: 'User updated', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update user' });
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    return res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete user' });
  }
};

// ---------- Stores ----------
// POST /api/admin/stores  (create store)
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    return res.status(201).json(store);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to create store' });
  }
};

// PUT /api/admin/stores/:id (update)
exports.updateStore = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, address, ownerId } = req.body;
    const s = await Store.findByPk(id);
    if (!s) return res.status(404).json({ message: 'Store not found' });
    s.name = name ?? s.name;
    s.email = email ?? s.email;
    s.address = address ?? s.address;
    s.ownerId = ownerId ?? s.ownerId;
    await s.save();
    return res.json({ message: 'Store updated', store: s });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update store' });
  }
};

// DELETE /api/admin/stores/:id
exports.deleteStore = async (req, res) => {
  try {
    const id = req.params.id;
    const s = await Store.findByPk(id);
    if (!s) return res.status(404).json({ message: 'Store not found' });
    await s.destroy();
    return res.json({ message: 'Store deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete store' });
  }
};

// GET /api/admin/stores  (list with avg rating)
exports.listStores = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', sort = 'name', order = 'ASC' } = req.query;
    const where = {};
    if (search) where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } }
    ];

    const stores = await Store.findAll({
      where,
      attributes: ['id','name','email','address','ownerId','createdAt'],
      include: [{
        model: Rating,
        attributes: []
      }],
      order: [[sort, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page)-1)*parseInt(limit),
      raw: false
    });

    // compute counts/average per store
    const results = await Promise.all(stores.map(async s => {
      const stats = await Rating.findOne({
        where: { storeId: s.id },
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'count'], [Sequelize.fn('AVG', Sequelize.col('rating')), 'avg']],
        raw: true
      });
      return {
        id: s.id, name: s.name, email: s.email, address: s.address, ownerId: s.ownerId,
        ratingCount: Number(stats.count || 0),
        averageRating: stats.avg ? Number(Number(stats.avg).toFixed(2)) : 0
      };
    }));

    return res.json({ page: parseInt(page), perPage: parseInt(limit), data: results });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to list stores' });
  }
};

// ---------- Dashboard ----------
// GET /api/admin/dashboard
exports.dashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    // top 5 stores by avg rating (simple approach)
    const stores = await Store.findAll();
    const storeStats = await Promise.all(stores.map(async s => {
      const stats = await Rating.findOne({
        where: { storeId: s.id },
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'count'], [Sequelize.fn('AVG', Sequelize.col('rating')), 'avg']],
        raw: true
      });
      return { id: s.id, name: s.name, count: Number(stats.count || 0), avg: stats.avg ? Number(Number(stats.avg).toFixed(2)) : 0 };
    }));
    storeStats.sort((a,b) => b.avg - a.avg);
    const topStores = storeStats.slice(0,5);

    return res.json({ totalUsers, totalStores, totalRatings, topStores });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to get dashboard' });
  }
};
