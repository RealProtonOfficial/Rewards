'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reward = sequelize.define('Reward', {
    userId: DataTypes.INTEGER,
    referralId: DataTypes.INTEGER,
    assetName: DataTypes.STRING,
    level: DataTypes.STRING,
    status: DataTypes.STRING,
    transferId: DataTypes.STRING,
    commissionPercentage: DataTypes.DOUBLE,
    assetAmount: DataTypes.DOUBLE,
    commissionAmount: DataTypes.DOUBLE,
    adminReceived: DataTypes.BOOLEAN
  }, {});
  Reward.associate = function(models) {
    // associations can be defined here
    Reward.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
    // Affiliate associate
    Reward.belongsTo(models.User, {
      as: 'referral',
      foreignKey: 'referralId'
    });
  };
  return Reward;
};
