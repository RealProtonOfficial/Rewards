'use strict';
module.exports = (sequelize, DataTypes) => {
  const ReferralManagement = sequelize.define('ReferralManagement', {
    type: {
      type: DataTypes.ENUM('level1', 'level2', 'level3'),
      allowNull: false
    },
    commission: {
      type: DataTypes.DOUBLE
    },
  }, {});
  ReferralManagement.associate = function(models) {
    // associations can be defined here
  };
  return ReferralManagement;
};