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
            User.hasMany(models.Reward, {
                as: 'rewards',
                foreignKey: 'userId'
            });
        }
    }

    User.init(
        {
              firstName: DataTypes.STRING
            , lastName: DataTypes.STRING
            , userName: DataTypes.STRING
            , email: DataTypes.STRING
            , status: DataTypes.STRING
            , referralCode: DataTypes.STRING
            , password: DataTypes.STRING
        }
        , {
            sequelize
            , modelName: 'User'
        }
    );

    return User;
};
