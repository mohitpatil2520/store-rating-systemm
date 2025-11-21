const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// models & db
const db = require('./models');

// 👇 REGISTER ROUTES
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/store');   
const ratingRoutes = require('./routes/rating'); 
const ownerRoutes = require('./routes/owner');   
const adminRoutes = require('./routes/admin');   // <-- ✅ ADD THIS LINE

app.get('/', (req, res) => res.json({ message: 'API running' }));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);             
app.use('/api/stores', ratingRoutes);            
app.use('/api/owner', ownerRoutes);              
app.use('/api/admin', adminRoutes);              // <-- ✅ ADD THIS LINE

// start & sync DB
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ DB connected');
    await db.sequelize.sync({ alter: true });
    console.log('✅ DB synced');

    app.listen(port, () => console.log(`Server listening on ${port}`));
  } catch (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
})();
