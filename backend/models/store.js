module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), validate: { isEmail: true }, allowNull: true },
    address: { type: DataTypes.STRING(400), allowNull: true }
  }, {
    tableName: 'stores'
  });

  Store.associate = models => {
    Store.hasMany(models.Rating, { foreignKey: 'storeId', onDelete: 'CASCADE' });
    Store.belongsTo(models.User, { as: 'owner', foreignKey: 'ownerId' });
  };

  return Store;
};
