'use strict';
const { User, Referee, Wallet } = require('../models/index');
const HttpResponse = require('../utilities/HttpResponse');
const {
    generateAccessToken,
    verifyAuthToken,
    verifySignature
} = require('../utilities/authentication');
const { check } = require('express-validator');
const { requestValidator } = require('../middlewares/errorHandler');
const { verifyRedisToken } = require('../utilities/redis');
const { URLS } = require('../config');
const bcrypt = require('bcrypt');
const ShortID = require('shortid');

// Authetication For User
exports.isAuthorized = async (req, res, next) => {
    console.log('middlewares/user.isAuthorized(req, res, next)');

    try {

        let authorizationHeader = req.header('Authorization');
        console.log('    authorizationHeader = ', authorizationHeader);

        if (!authorizationHeader)
            return HttpResponse.authorizationErrorResponse(res, 'Authorization token required');

        const decodedToken = await verifyAuthToken(authorizationHeader);
        //console.log('    decodedToken = ', decodedToken);

        if (!decodedToken || decodedToken === 'jwt expired') {
            return HttpResponse.authorizationErrorResponse(res, 'Authorization token invalid or expired');
        }

        if (!decodedToken)
            //return HttpResponse.authorizationErrorResponse(res, 'Token problem please try again');
            return HttpResponse.authorizationErrorResponse(res, 'The authorization token is no longer valid.');

        console.log('    decodedToken.id = ', decodedToken.id);
        console.log('    decodedToken.email = ', decodedToken.email);

        const redisData = await verifyRedisToken(authorizationHeader); // verify token in redis
        console.log('    redisData = ', redisData);

        //if (!redisData)
        if (redisData == null || Object.keys(redisData).length === 0) {
            console.log('The Redis token no longer exists.');
            //return HttpResponse.authorizationErrorResponse(res, 'The Redis Token No Longer Exists.');
            return HttpResponse.authorizationErrorResponse(res, 'Session has timed out.');
        }

        const query = {
            id: decodedToken.id,
            publicAddress: decodedToken.publicAddress
        };
        console.log('    query = ', query);

        const user = await User.findOne({ where: query });
        //console.log('user = ', user);
        console.log('    user.id = ', user?.id);
        console.log('    user.email = ', user?.email);

        if (!user) return HttpResponse.notFoundResponse(res, 'User not found.');

        if (user.isBlock === true)
            return HttpResponse.accessErrorResponse(res, 'Your account is blocked.');

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return HttpResponse.serverErrorResponse(res, 'Error in middlewares/user.isAuthorized()', error);
    }
};

exports.checkProfileData = [
    check('email').not().isEmpty().withMessage('Please provide public email !'),
    requestValidator
];

exports.checkQuery = [
    check('name').not().isEmpty().withMessage('Please provide a valid name !'),
    check('email').not().isEmpty().withMessage('Please provide valid email!'),
    check('message').not().isEmpty().withMessage('Please provide your query!'),
    requestValidator
];

exports.checkSubscriber = [
    check('email').not().isEmpty().withMessage('Please provide valid email !'),
    requestValidator
];
