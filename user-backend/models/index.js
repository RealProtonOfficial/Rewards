'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const config = JSON.parse(process.env.DATABASE_CONFIG)[env];
console.log('models: env = ', env);
console.log('models: config = ', config);
const loggerUtil = require('../utilities/logger');
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config, {
        logging: console.log
    });
} else {
    sequelize = new Sequelize(
          config.database
        , config.username
        , config.password
        , config
    );
}

console.log('models: sequelize.authenticate()');
sequelize
    .authenticate()
    .then(() =>
        loggerUtil.log({
              message: 'DB connected successfully'
            , level: 'info'
        })
    )
    .catch(er =>
        loggerUtil.error({
              message: er.toString()
            , level: 'error'
        })
    );

fs.readdirSync(__dirname)
    .filter(file => {
        console.log('fs.readdirSync('+__dirname+').filter(file => {', file);
        return (
            file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
        );
    })
    .forEach(file => {
        console.log('fs.readdirSync('+__dirname+').forEach(file => {', file);
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        console.log('model = ', model);
        console.log('model.name = ', model.name);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        //console.log('db['+modelName+'].associate(db)');
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
