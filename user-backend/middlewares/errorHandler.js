const responseHelper = require('./response');
const logHelper = require('./logger');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logHelper.error(err.message);

  if (typeof err === 'string') {
    // custom application error
    return responseHelper.badRequestErrorResponse(res, err);
  }

  if (err.name === 'ValidationError') {
    // mongoose validation error
    return responseHelper.badRequestErrorResponse(res, err.message);
  }

  if (err.name === 'UnauthorizedError') {
    // jwt authentication error
    return responseHelper.authorizationErrorResponse(res, err.message);
  }

  if (err.message === 'Not allowed by CORS') {
    // jwt authentication error
    return responseHelper.accessErrorResponse(res, err.message);
  }

  return responseHelper.serverErrorResponse(res);
}

module.exports = errorHandler;
