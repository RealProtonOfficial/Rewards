const jwt = require('jsonwebtoken');
const {
    JWT: { ACCESS_TOKEN, REFRESH_TOKEN }
} = require('../config/index');

// Create Token with Payload
// const generateAccessToken = async (model = 'adminUser', payload) => {
//   const signedJWTToken = jwt.sign(model === 'adminUser' ? { adminUser: payload } : { user: payload },
//     ACCESS_TOKEN.SECRET_KEY, { expiresIn: `${ACCESS_TOKEN.EXPIRY}` || '1y' });
//   return { accessToken: signedJWTToken, expiresIn: ACCESS_TOKEN.EXPIRY };
// };
const generateAccessToken = async (model, payload) => {
    console.log('utilities/authentication.generateAccessToken(model:'+model+', payload:'+payload+')');
    console.log('    ACCESS_TOKEN.SECRET_KEY = ', ACCESS_TOKEN.SECRET_KEY);
    const token = jwt.sign(
          payload
        , ACCESS_TOKEN.SECRET_KEY
        , {
            expiresIn: '1d' || `${process.env.ACCESS_TOKEN_EXPIRY}`
        }
    );
    console.log('    token = ', token);

    return {
        accessToken: token,
        expiresIn: ACCESS_TOKEN.EXPIRY,
        userId: payload.id
    };
};

// Generate Refresh Token
const generateRefreshToken = payload => {
  const token = jwt.sign(payload, REFRESH_TOKEN.SECRET_KEY, {
    expiresIn: `${REFRESH_TOKEN.EXPIRY}s`
  });
  return {
    refreshToken: token,
    refreshExpiresIn: REFRESH_TOKEN.EXPIRY
  };
};

// Verify Authentication Token
const verifyAuthToken = async (jwtString, isVerifyEmail) => {
    console.log('utilities/authentication.verifyAuthToken(jwtString:'+jwtString+', isVerifyEmail:'+isVerifyEmail+')');
    const splitString = jwtString.split(' ');
    console.log('    splitString = ', splitString);
    console.log('    ACCESS_TOKEN.SECRET_KEY = ', ACCESS_TOKEN.SECRET_KEY);
    return jwt.verify(
        isVerifyEmail ? splitString[0] : splitString[1]
        , ACCESS_TOKEN.SECRET_KEY
        , (err, decoded) => {
            console.log('        err = ', err);
            //console.log('        decoded = ', decoded);
            return err ? err.message : decoded; // if token expired
        }
    );
};

// const verifyAuthToken = async (jwtString) => {
//   return jwt.verify(jwtString, ACCESS_TOKEN.SECRET_KEY, (err, decoded) => {
//     return err ? err.message : decoded; // if token expired
//   });
// };

module.exports = {
      generateAccessToken
    , generateRefreshToken
    , verifyAuthToken
};
