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
const { URLS } = require('../config');
const bcrypt = require('bcrypt');
const ShortID = require('shortid');

exports.userAuthSignature = async (req, res, next) => {
    console.log('middlewares/user.userAuthSignature(req, res, next)');

    try {

        const { referralCode, email, password } = req.body;
        
        console.log('referralCode = ', referralCode);
        console.log('email = ', email);
        console.log('password = ', password);

        if (!password) return HttpResponse.serverErrorResponse(res, 'Alert!', 'Password field is missing.');
        
        let user = await User.findOne({ where: {email: email } });

        if (!user) {

            return HttpResponse.serverErrorResponse(res, 'Alert!', 'A user account with this email address was not found.');

        } else {

            //console.log("user = ", user);
            console.log("user.id = ", user.id);
            console.log("user.email = ", user.email);

            if (user.isBlock === true) return HttpResponse.accessErrorResponse(res, `Your account is blocked by the administrator.`);

            if (user.status != 'verified') return HttpResponse.accessErrorResponse(res, `Your email address is unverifed. Please check your spam mail for an account activation email from us, or try resetting your password.`);

            //console.log("password = ", password);
            //if (!password) return HttpResponse.serverErrorResponse(res, 'Alert!', 'Password field is missing.');

            console.log("user.password = ", user.password);
            if (!user.password) return HttpResponse.serverErrorResponse(res, 'Alert!', 'Your account does not have a password set.');

            if (
                user.email === email
                &&
                    (await bcrypt.compare(password, user.password))
            ) {
                req.user = user;
                next();
            } else {
                return HttpResponse.accessErrorResponse(res, `Your password is incorrect.`);
            }
        }

    } catch (error) {
        console.log(error);
        return HttpResponse.serverErrorResponse(res, 'Something went wrong in middlewares/user.userAuthSignature()', error);
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
