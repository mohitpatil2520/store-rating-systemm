// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const { authenticateJWT, requireRole } = require('../middleware/auth');

// all admin routes require 'admin'
router.use(authenticateJWT, requireRole('admin'));

// Users
router.post('/users', adminCtrl.createUser);
router.get('/users', adminCtrl.listUsers);
router.put('/users/:id', adminCtrl.updateUser);
router.delete('/users/:id', adminCtrl.deleteUser);

// Stores
router.post('/stores', adminCtrl.createStore);
router.get('/stores', adminCtrl.listStores);
router.put('/stores/:id', adminCtrl.updateStore);
router.delete('/stores/:id', adminCtrl.deleteStore);

// Dashboard
router.get('/dashboard', adminCtrl.dashboard);

module.exports = router;
