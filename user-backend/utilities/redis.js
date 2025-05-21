// 'use strict';

// const bluebird = require('bluebird');
// const redis = require('redis');
// const jwt = require('jsonwebtoken');

// // returns responses using a callback function to return responses in a promise object
// bluebird.promisifyAll(redis.RedisClient.prototype);

// // redis only support callback

// const config = require('../config');
// const loggerUtil = require('./logger');

// // HOST and PORT of the redis has to mention here.
// const client = redis.createClient({
//   host: config.REDIS.HOST,
//   port: config.REDIS.PORT
// });
// // Setting a key-value pair in redis with expiry time during the login session of any user
// exports.loginSession = async (userData, stayLoggedIn) => {
//   const token = jwt.sign(config.JWT.PAYLOAD, config.JWT.SECRET_KEY);
//   try {
//     const expiry = stayLoggedIn ? 8.64e11 : config.REDIS.TOKEN_EXP;
//     await client.setAsync(token, JSON.stringify(userData), 'EX', expiry);
//     return token;
//   } catch (ex) {
//     loggerUtil.error({
//       message: ex.toString(),
//       level: 'error'
//     });
//     return false;
//   }
// };
// // Checking whether the key passed is valid or not. If valid, corresponding value will be returned
// exports.checkSession = async (token) => {
//   try {
//     const userData = await client.getAsync(token);
//     return JSON.parse(userData);
//   } catch (ex) {
//     loggerUtil.error({
//       message: ex.toString(),
//       level: 'error'
//     });
//     return false;
//   }
// };
// // Deleting the redis key once the user click on logout
// exports.logoutSession = async (token) => {
//   try {
//     await client.delAsync(token);
//     return true;
//   } catch (ex) {
//     loggerUtil.error({
//       message: ex.toString(),
//       level: 'error'
//     });
//     return false;
//   }
// };
// // Creating a time based otp session for multiple uses
// exports.otpCreateSession = async (email, otp) => {
//   try {
//     await client.setAsync(email, otp, 'EX', config.REDIS.OTP_EXP);
//     return true;
//   } catch (ex) {
//     loggerUtil.error({
//       message: ex.toString(),
//       level: 'error'
//     });
//     return false;
//   }
// };
// // Checking the otp key is valid or not. If valid the corresponding values will be provided.
// exports.otpCheckSession = async (email, otp) => {
//   try {
//     const redisOtp = await client.getAsync(email);
//     return (redisOtp === otp);
//   } catch (ex) {
//     loggerUtil.error({
//       message: ex.toString(),
//       level: 'error'
//     });
//     return false;
//   }
// };
// // Once the otp is verified, the saved key-value pair will be deleted here.
// exports.otpDeleteSession = async (email) => {
//   try {
//     await client.delAsync(email);
//     return true;
//   } catch (ex) {
//     loggerUtil.error({
//       message: ex.toString(),
//       level: 'error'
//     });
//     return false;
//   }
  // };

const Redis = require('ioredis');
const jwt = require('jsonwebtoken');
const {
  JWT: { ACCESS_TOKEN }
} = require('../config/index');

exports.loginSession = async (userDetails, callBack) => {
    console.log('utilities/redis.loginSession(userDetails, callBack)', userDetails);

    const token = jwt.sign(
        userDetails
        , process.env.ACCESS_TOKEN_SECRET
        , {
            expiresIn: '1d' || `${process.env.ACCESS_TOKEN_EXPIRY}`
        }
    );
    console.log('    token = ', token);

    const client = new Redis({
          port: process.env.REDIS_PORT
        , host: process.env.REDIS_HOST
    });
    console.log('    client = ', client);

    // set in redis with key as jwt
    // generate jwt token
    client.set(token, JSON.stringify(userDetails), error => {
        if (error) {
            console.log(error);
            console.error(error);
            callBack(false);
        } else {
            client.expire(token, process.env.RESET_TOKEN_TIME, setExpError => {
                client.disconnect();
                if (setExpError) {
                    callBack(false);
                } else {
                    callBack({
                          accessToken: token
                        , expiresIn: ACCESS_TOKEN.EXPIRY
                        , userId: userDetails.id
                        , email: userDetails.email
                        //textureCapitalCustomerId: userDetails.textureCapitalCustomerId
                    });
                }
            });
        }
    });
};

/*
 * The string token here is the Bearer header including the 'Bearer' keyword.
 * @return the redis data object
 */
exports.verifyRedisToken = async token => {
    console.log('utilities/redis.verifyRedisToken("'+token+'")');

    const splitString = token.split(' ');
    //console.log('    splitString = ', splitString);

    const redisConfig = {
          port: process.env.REDIS_PORT
        , host: process.env.REDIS_HOST
    };
    console.log('    redisConfig = ', redisConfig);

    const redisClient = new Redis(redisConfig);
    //console.log('redisClient = ', redisClient);

    const redisData = await redisClient.get(splitString[1]);
    console.log('    redisData = ', redisData);
    console.log('    typeof redisData = ', typeof redisData);

    return JSON.parse(redisData);
};

exports.removeRedisToken = async token => {
  const string = token.split(' ');
  const client = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST
  });
  const deleteToken = await client.del(string[1]);
  return deleteToken;
};
