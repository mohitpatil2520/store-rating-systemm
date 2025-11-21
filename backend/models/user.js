module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    address: { type: DataTypes.STRING(400) },
    role: { type: DataTypes.ENUM('admin', 'user', 'owner'), defaultValue: 'user' }
  }, {
    tableName: 'users'
  });

  User.associate = models => {
    User.hasMany(models.Rating, { foreignKey: 'userId', onDelete: 'CASCADE' });
    User.hasMany(models.Store, { foreignKey: 'ownerId', onDelete: 'SET NULL' });
  };

  return User;
};
