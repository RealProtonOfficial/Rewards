'use strict';
const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AdminUser.belongsTo(models.Role, {
        as: 'roles',
        foreignKey: 'roleId'
      });
    }
  };
  AdminUser.init({
    thumbnailImageUrl: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        isEmail: {
          msg: "Enter a valid email address",
        }
      },
      unique: { msg: 'Email address already in use!' }
    },
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    status: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    // secretKey: DataTypes.STRING,
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'Roles',
          key: 'id'
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isScan: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'AdminUser',
  });

  AdminUser.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, 10)
      .then(hash => {
        user.password = hash;
      })
      .catch(err => {
        throw new Error(err);
      });
  });

  AdminUser.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };


  return AdminUser;
};