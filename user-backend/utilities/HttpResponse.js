'use strict';

const config = require('../config');
const loggerUtil = require('./logger');
const messageUtil = require('./message');

exports.successResponse = (res, message, result) => {

    const response = {
      success: true,
      message: message
    };

    if (result) response.result = result;

    res.status(config.HTTP_STATUS_CODES.OK).send(response);
};

exports.notFoundResponse = (res, message) => {
  
    const response = {
        success: false
        , message: message
    };

    res.status(config.HTTP_STATUS_CODES.NOT_FOUND).send(response);
};

exports.serverErrorResponse = (res, message, error) => {
    loggerUtil.error({
          message: message
        , error: error
        , level: 'error'
    });

    if (error.toString() !== '[object Object]') {
        error = error.toString();
    }

    res.status(config.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        success: false
        , error: error
        , message: message
    });
};

exports.validationErrorResponse = (res, message, errors) => {
  res.status(config.HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY).json({
    success: false,
    message: message,
    errors: errors
  });
};

exports.badRequestErrorResponse = (res, message, errors) => {
  res.status(config.HTTP_STATUS_CODES.BAD_REQUEST).send({
    success: false,
    message: message,
    errors: errors
  });
};

exports.authorizationErrorResponse = (res, message) => {
  res.status(config.HTTP_STATUS_CODES.UNAUTHORIZED).send({
    success: false,
    message: message
  });
};

exports.accessErrorResponse = (res, message) => {
  res.status(config.HTTP_STATUS_CODES.FORBIDDEN).send({
    success: false,
    message: message
  });
};

// To show error message directly to UI
exports.errorInResponse = (res, message) => {
  const response = {
    success: false,
    message: message
  };
  res.status(config.HTTP_STATUS_CODES.OK).send(response);
};


// // my error handling
// const builder = {
//   wrong_credentials: (prefix) => builder.prepare(403, prefix, 'Invalid credentials'),
//   unauthorized: (prefix) => builder.prepare(401, prefix, 'Authentication Error, Please try logging again'),
//   invalid_req: (prefix) => builder.prepare(406, prefix, 'invalid Request'),
//   wrong_otp: (prefix) => builder.prepare(403, prefix, 'entered OTP is invalid'),
//   server_error: (prefix) => builder.prepare(500, prefix, 'server error'),
//   server_maintenance: (prefix) => builder.prepare(500, prefix, 'maintenance mode is active'),
//   inactive: (prefix) => builder.prepare(403, prefix, 'inactive'),
//   not_found: (prefix) => builder.prepare(404, prefix, 'not found'),
//   not_matched: (prefix) => builder.prepare(406, prefix, 'not matched'),
//   not_verified: (prefix) => builder.prepare(406, prefix, 'not verified'),
//   already_exists: (prefix) => builder.prepare(409, prefix, 'already exists'),
//   user_deleted: (prefix) => builder.prepare(406, prefix, 'deleted by admin'),
//   user_blocked: (prefix) => builder.prepare(406, prefix, 'blocked by admin'),
//   required_field: (prefix) => builder.prepare(419, prefix, 'field required'),
//   too_many_request: (prefix) => builder.prepare(429, prefix, 'too many request'),
//   expired: (prefix) => builder.prepare(417, prefix, 'expired'),
//   canceled: (prefix) => builder.prepare(419, prefix, 'canceled'),
//   created: (prefix) => builder.prepare(200, prefix, 'created'),
//   updated: (prefix) => builder.prepare(200, prefix, 'updated'),
//   deleted: (prefix) => builder.prepare(417, prefix, 'deleted'),
//   blocked: (prefix) => builder.prepare(401, prefix, 'blocked'),
//   success: (prefix) => builder.prepare(200, prefix, 'success'),
//   successfully: (prefix) => builder.prepare(200, prefix, 'successfully'),
//   error: (prefix) => builder.prepare(500, prefix, 'error'),
//   no_prefix: (prefix) => builder.prepare(200, prefix, ''),
// };

// Object.defineProperty(builder, 'prepare', {
//   enumerable: false,
//   configurable: false,
//   writable: false,
//   value: (code, prefix, message) => ({
//     code,
//     message: `${prefix ? `${prefix} ${message}` : message}`,
//   }),
// });

// module.exports = builder;
