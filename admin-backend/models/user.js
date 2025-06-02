/** @format */

'use strict';
// const bcrypt = require('bcrypt');

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Wallet, {
        as: 'wallet',
        foreignKey: 'userId'
      });
      User.hasMany(models.Reward, {
        as: 'rewards',
        foreignKey: 'userId'
      });
      User.hasMany(models.Order, {
        as: 'orders',
        foreignKey: 'userId'
      });
      User.hasMany(models.Bid, {
        as: 'bidder',
        foreignKey: 'userId'
      });
      User.hasMany(models.Asset, {
        as: 'assets',
        foreignKey: 'purchasedBy'
      });
      User.hasMany(models.UserAddress, {
        as: 'addresses',
        foreignKey: 'userId'
      });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      userName: DataTypes.STRING,
      email: DataTypes.STRING,
      publicAddress: DataTypes.STRING,
      profilePicUrl: DataTypes.STRING,
      status: DataTypes.STRING,
      referralCode: DataTypes.STRING,
      walletId: DataTypes.STRING,
      kycUserId: DataTypes.STRING,
      kycStatus: DataTypes.STRING,
      kycUserData: DataTypes.JSONB,
      password: DataTypes.STRING,
      kycVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isRegistered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isBlock: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'User'
    }
  );



  return User;
};
