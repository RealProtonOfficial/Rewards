require('dotenv').config();
const dbConstants = require('./dbConstants.json');

// Dotenv.config({
//   silent: true
// });

module.exports = {

    DB_CONSTANTS: dbConstants

    , HTTP_STATUS_CODES: {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        UNPROCESSABLE_ENTITY: 422,
        TOO_MANY_REQUESTS: 429,
        INTERNAL_SERVER_ERROR: 500,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503
    }

    , DB: {
        USERNAME: process.env.DB_USERNAME || 'postgres',
        PASSWORD: process.env.DB_PASSWORD || '<YOUR_PASSWORD>',
        NAME: process.env.DB_NAME || 'affiliate_referrals',
        HOST: process.env.DB_HOST || 'localhost',
        DIALECT: process.env.DB_DIALECT || 'postgres',
        PORT: process.env.DB_PORT || '5432'
    }

    , JWT: {
        ACCESS_TOKEN: {
          SECRET_KEY: process.env.ACCESS_TOKEN_SECRET || 's$e@c#r$e8t$K_e&y',
          EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || 86400
        },
        REFRESH_TOKEN: {
          SECRET_KEY: process.env.REFRESH_TOKEN_SECRET || 's%e$c#r@e8t$K_e&y',
          EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || 86400
        }
    }

    , URLS: {
        FRONTEND:
          process.env.FRONT_BASE_URL || 'http://localhost:3000/',
        BACKEND:
          process.env.USER_BASE_URL ||
          'http://localhost:3000/user/v1/',
        MSG: process.env.SIGN_MESSAGE || 'Welcome',
        AUCTION_STATUS: {
          won: 'won',
          lost: 'lost',
          active: 'active'
        }
    }

    , USER_SIDE_ENV_DEV: {
          REACT_APP_API_URL:     process.env.REACT_APP_API_URL
        , REACT_APP_ADMIN_URL:   process.env.REACT_APP_ADMIN_URL
    }

    , USER_SIDE_ENV_PROD: {
          REACT_APP_API_URL:   process.env.REACT_APP_API_URL
        , REACT_APP_ADMIN_URL: process.env.REACT_APP_ADMIN_URL
    }
};
