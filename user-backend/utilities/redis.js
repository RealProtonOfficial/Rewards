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

    // Temporary short circuit to bypass Redis Server to expedite delivery
    callBack({
          accessToken: token
        , expiresIn: ACCESS_TOKEN.EXPIRY
        , userId: userDetails.id
        , email: userDetails.email
        //textureCapitalCustomerId: userDetails.textureCapitalCustomerId
    });

};