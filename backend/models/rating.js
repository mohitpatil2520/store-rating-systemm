module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    rating: { type: DataTypes.TINYINT, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: 'ratings'
  });

  Rating.associate = models => {
    Rating.belongsTo(models.User, { foreignKey: 'userId' });
    Rating.belongsTo(models.Store, { foreignKey: 'storeId' });
  };

  return Rating;
};
