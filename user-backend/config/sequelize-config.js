require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
console.log('env = ', env)
const config = JSON.parse(process.env.DATABASE_CONFIG)[env];
console.log('config = ', config)
module.exports = config;