'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Referee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Referee.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId'
      });
      Referee.belongsTo(models.User, {
        as: 'level1',
        foreignKey: 'rLevel1'
      });
      Referee.belongsTo(models.User, {
        as: 'level2',
        foreignKey: 'rLevel2'
      });
      Referee.belongsTo(models.User, {
        as: 'level3',
        foreignKey: 'rLevel3'
      });
    }
  }
  Referee.init({
    userId: DataTypes.INTEGER,
    rLevel1: DataTypes.INTEGER,
    rLevel2: DataTypes.INTEGER,
    rLevel3: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Referee',
  });
  return Referee;
};