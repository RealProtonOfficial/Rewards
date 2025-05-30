"use strict";

const HttpResponse = require("../utilities/HttpResponse");

const {
      generateAccessToken
    , verifyAuthToken
} = require("../utilities/authentication");

const { loginSession, removeRedisToken } = require("../utilities/redis");

const {
      User
    , Subscriber
    , Referee
    , Wallet
    , UserAddress
    , UserAsset
} = require("../models/index");

//const { generateToken } = require('utilities/crypto');
const { generateToken } = require('../utilities/hashUtils');
const bcrypt = require('bcrypt');
const ShortID = require('shortid');
/*
const {
    loginAdmin
    , logOutUser
    , requestUserPasswordReset
    , resetUserPassword
    , verifyTOTPcode
    , signUpAdmin
    , changePassword
} = require('../controllers/user');
*/

//const sendgrid = require("../utilities/sendgrid"); // Email sending removed to expedite delivery
//const { Op } = require("sequelize");
const { Op, Sequelize } = require('sequelize');
const { URLS } = require("../config");
const { slugify } = require("../utilities/stringUtils");

/**
   * This file contains controllers of asset order details.

   * @function { authSignature } is generating access token for user.
   * @function { logout } is for ending session of user.
   * @function { getProfile } is for getting user's profile.
   * @function { updateProfile } is for updating user's profile details.
   * @function { uploadProfilePic } is for uploading user's profile picture on aws.
   * @function { verifyEmail } is for verifying email of user based on token.
   * @function { postVerificationMail } is for send verification mail again on registered email.
   * @function { subscribe } is for fetch subscriber details.
   * @function { generateReferralLink } is for generating unique referralLink for each user.
   *
*/

exports.forgotPassword = (req, res, next) => {
    console.log('controllers/user: forgotPassword(req, res, next)');

    const email = req.body.email;
    console.log('email = ', email);

    requestUserPasswordReset(email)
        .then(async responseData => {
            console.log('responseData = ', responseData);

            /*
            const notification = {
                  email: email
                , token: responseData.token
                , link: `${process.env.WEB_BASE_URL}/forgot-password?token=${responseData.token}&email=${email}`
            };
            console.log('notification = ', notification);
            HttpResponse.successResponse(res, 'Please check your email to continue resetting your password.', notification);
            */
            HttpResponse.successResponse(res, 'Please check your email to continue resetting your password.');
        })
        //.catch((error) => next(error));
        //} catch (err) {
        .catch((error) => {
            console.log(error);
            console.log('error?.message = ', error?.message);
            //return HttpResponse.serverErrorResponse(res'Error in adminAuth.js: forgot()', error);
            //return HttpResponse.serverErrorResponse(res, error?.message, error?.message);
            return HttpResponse.badRequestErrorResponse(res, error?.message, [ error?.message ]);
        });
};

exports.authSignature = async (req, res) => {
    try {
        const user = req.user;
        loginSession(
            {
                id: user.id
                //, publicAddress: user.publicAddress
                , email: user.email
            }
            , (secureToken) => {
                if (!secureToken) {
                    return HttpResponse.accessErrorResponse(res, "Access token not created");
                }
                return HttpResponse.successResponse(
                    res
                    , "User Credentials Verified"
                    , secureToken
                );
            }
        );
    } catch (error) {
        console.log(error, "Authentication signature");
        return HttpResponse.serverErrorResponse(res, error.message, error);
    }
};

exports.logOutUser = async (req, res) => {
  try {
    const isRemove = await removeRedisToken(req.header("Authorization"));
    return HttpResponse.successResponse(res, "User logout succesfully!");
  } catch (error) {
    console.log(error, "Authentication signature");
    return HttpResponse.serverErrorResponse(res, error.message, error);
  }
};

exports.getProfile = async (req, res) => {
    console.log('controllers/user: getProfile(req, res)');
    try {

        let user = req.user;
        const findQuery = { id: user.id };

        let userObject = await User.findOne({
            where: findQuery
            /*
            , attributes: {
                include: [
                    [
                        Sequelize.fn('COUNT', Sequelize.col('userAssets.id'))
                        , 'assetsCount'
                    ]
                ]
            }
            */
            , include: [
                {
                    model: Wallet
                    , as: "wallet"
                }
                , {
                    model: UserAddress
                    , as: "addresses"
                }
                //*
                , {
                    model: UserAsset
                    , as: "userAssets"
                }
                //*/
            ]
        });

        if (!userObject) return HttpResponse.notFoundResponse(res, "User not found");
        return HttpResponse.successResponse(res, "User profile details fetched", userObject);
    } catch (error) {
        console.error(error);
        console.log('error = ', error);
        return HttpResponse.serverErrorResponse(res, "Something went wrong in controller", error);
    }
};

exports.checkUserExist = async (req, res) => {
    console.log('controllers/user: checkUserExist(req, res)');

    try {

        const user = await User.findOne({
            where: { email: req.body.username }
        });
        
        return HttpResponse.successResponse(res, "User profile check", {
            existed: !!user
        });

    } catch (error) {
        return HttpResponse.serverErrorResponse(
              res
            , "Something went wrong in checkUserExist"
            , error
        );
    }
};

exports.registerUser = async (req, res) => {
    console.log('controllers/user: registerUser(req, res)');

    try {

        const {
            signature
            , publicAddress
            , referralCode
            , email
            , password
            , username
            , firstName
            , lastName
        } = req.body;

        console.log('signature = ', signature);
        console.log('publicAddress = ', publicAddress);
        console.log('referralCode = ', referralCode);
        console.log('email = ', email);
        console.log('password = ', password);
        console.log('username = ', username);
        console.log('firstName = ', firstName);
        console.log('lastName = ', lastName);

        let user = await User.findOne({
            where: { email: username }
        });
        console.log('user = ', user);
        
        /*
        return HttpResponse.successResponse(
            res
            , "User profile check", {
                existed: !!user
            }
        );
        */

        /*
        let { type } = req.query;
        console.log('type = ', type);
        if (!type) type = METAMASK;
        
        if (!signature && type === METAMASK)
            return HttpResponse.notFoundResponse(res, 'Signature not found.');
        
        // Get the user using the public address
        if (type === METAMASK) {

            if (!publicAddress)
                return HttpResponse.notFoundResponse(res, 'PublicAddress not found.');

            let user = await User.findOne({
                where: { publicAddress: publicAddress }
            });
        */

        //if (!user) {
        if (user == null) {

            console.log("password = ", password);
            const hash = await bcrypt.hash(password, 10);
            console.log("hash = ", hash);

            let userObject = {
                  status: 'unverified'
                , referralCode: ShortID.generate().toUpperCase()
                , isRegistered: true
                , email: username
                , firstName: firstName
                , lastName: lastName
                , password: hash
            };
            console.log("userObject = ", userObject);

            try {

                user = await User.create(userObject);
                //console.log("New user = ", user);
                console.log("New user.id = ", user?.id);
                console.log("New user.email = ", user?.email);

                let accessTokenObject = {
                      id: user.id
                    //, email: username
                    , email: user.email
                };
                console.log("accessTokenObject = ", accessTokenObject);

                const secureTokenObject = await generateAccessToken(null, accessTokenObject);
                console.log("secureTokenObject = ", secureTokenObject);
                console.log("secureTokenObject.accessToken = ", secureTokenObject?.accessToken);

                if (!secureTokenObject) return response.accessErrorResponse(res, 'Verification token not created');

                const verifyLink = `${ URLS.BACKEND }user/verify-email?token=${ secureTokenObject?.accessToken }`;
                console.log("verifyLink = ", verifyLink);

                /* Removed Sendgrid sending to expedite delivery. The verifiation link can get read from the console log.
                let emailSendingConfig = {
                      email: user.email
                    , userName: 'User'
                    , sLink: verifyLink
                    , sUrl: `${process.env.FRONT_BASE_URL}`
                    , frontURL: `${URLS.FRONTEND}`
                    , frontURL: process.env.FRONT_BASE_URL
                    , tcURL: `${process.env.FRONT_BASE_URL}terms-and-conditions`
                };
                console.log("emailSendingConfig = ", emailSendingConfig);

                await sendgrid.send(
                      sendgrid.verification
                    , emailSendingConfig
                );
                */

                //userObject.id = user.id; // Set the user ID in the 
                let levelPayload;
                
                console.log("referralCode = ", referralCode);
                if (referralCode) {

                    let referralObject = {
                          where: { referralCode: referralCode }
                        , raw: true
                    };
                    console.log("referralObject = ", referralObject);

                    // Fetch this new user's referrer
                    const referrerDetails = await User.findOne(referralObject);
                    console.log('referrerDetails = ', referrerDetails);

                    if (referrerDetails) {
                        console.log('referrerDetails.id = ', referrerDetails?.id);
                        console.log('referrerDetails.email = ', referrerDetails?.email);

                        // fetch referrer levels
                        const referrerHierarchy = await Referee.findOne({
                              where: { userId: referrerDetails.id }
                            , raw: true
                        });
                        console.log('referrerHierarchy = ', referrerHierarchy);

                        // create referrer entry for new user
                        levelPayload = {
                              userId: user.id // new user
                            , rLevel1: referrerDetails.id // new user's referrer
                            , rLevel2: referrerHierarchy.rLevel1 // user's referrer's rLevel1
                            , rLevel3: referrerHierarchy.rLevel2 // user's referrer's rLevel2
                        };
                        console.log('levelPayload = ', levelPayload);

                        // Create referrer entry for new user
                        await Referee.create(levelPayload);
                        console.log("New Referee: ", user.id);
                    }

                } else {

                    levelPayload = {
                        userId: user.id // new user
                    };

                    // Create referrer entry for new user
                    await Referee.create(levelPayload);
                    console.log("New Referee: ", user.id);
                }

                /*
                let responseObject = {
                    existed: !!user
                };
                */
                userObject.id = user.id;

                return HttpResponse.successResponse(
                    res
                    , "New User Registered"
                    //, responseObject
                    , userObject
                    //, user
                );

            } catch(error) {

                console.error(error);
                console.log("error = ", error);

                /*
                    E.g.
                        errors: [
                          ValidationErrorItem {
                            message: 'id must be unique',
                            type: 'unique violation',
                            path: 'id',
                            value: '3',
                            origin: 'DB',
                            instance: [User],
                            validatorKey: 'not_unique',
                            validatorName: null,
                            validatorArgs: []
                          }
                        ]
                */
                let errorMessage = 'Something went wrong in user.registerUser()';
                let errors = error.errors;
                if (errors && errors.length > 0) {
                    let errorObject = errors[0];
                    if (errorObject) {
                        errorMessage = errorObject.message;
                    }
                }
                console.log("errorMessage = ", errorMessage);

                return HttpResponse.serverErrorResponse(
                      res
                    , errorMessage
                    , error
                );

            }

        } else {

            console.log(user);

            return HttpResponse.serverErrorResponse(
                res
                , 'User Already Exists'
                , 'A user account already exists for this email address. Try logging in or resetting your password.'
            );
        }

    } catch (error) {

        console.error(error);
        console.log("error = ", error);

        return HttpResponse.serverErrorResponse(
              res
            , "Something went wrong in user.registerUser()"
            , error
        );
    }
};

exports.verifyEmail = async (req, res) => {
    console.log('controllers/user: verifyEmail(req, res)');

    try {

        const { token } = req.query;
        console.log("token = ", token);
        const decodedToken = await verifyAuthToken(token, true);
        console.log("decodedToken = ", decodedToken);

        if (!decodedToken || decodedToken === "jwt expired") return HttpResponse.authorizationErrorResponse(res, "Authorization Token Invalid or Expired");

        const findQuery = {
              id: decodedToken.id
            , email: decodedToken.email
            , status: "unverified"
        };
        console.log("findQuery = ", findQuery);

        const updateQuery = { status: "verified" };
        let user = await User.findOne({ where: findQuery });
        if (!user) return res.sendFile("try-again.html", { root: "public" });

        user = await User.update(updateQuery, { where: findQuery });
        if (user[0] !== 1) return res.sendFile('try-again.html', { root: ('public') });
        return res.sendFile("verification-template.html", { root: "public" });
    } catch (error) {
        console.log(error)
        console.log("Error in verify email ===> ", error);
        return res.sendFile("try-again.html", { root: "public" });
    }
};

exports.postVerificationMail = async (req, res) => {
    console.log("postVerificationMail(req, res)");

    try {

        let user = req.user;
        const findQuery = {
              id: user.id
            , email: user.email
            , status: "unverified"
        };

        user = await User.findOne({ where: findQuery });
        console.log("user = ", user);

        if (!user)       return HttpResponse.notFoundResponse(res, "User Not Found");
        if (!user.email) return HttpResponse.notFoundResponse(res, "Please Provide Email Address");

        sendVerificationMail(user);

    } catch (error) {
        return HttpResponse.serverErrorResponse(res, "Error in controllers/user.js: postVerificationMail()", error);
    }
};

const sendVerificationMail = async (user) => {
    console.log("sendVerificationMail(user)");

    try {

        let userObject = {
              id:    user.id
            , email: user.email
        };
        console.log("userObject = ", userObject);

        const secureTokenObject = await generateAccessToken(null, userObject);
        console.log("secureTokenObject = ", secureTokenObject);

        if (!secureTokenObject) return HttpResponse.accessErrorResponse(res, "Verification Token Not Created");
        
        const verifyLink = `${process.env.USER_BASE_URL}/user/verify-email?token=${secureTokenObject.accessToken}`;
        console.log("verifyLink = ", verifyLink);

        console.log(`Sending verify email address automated email to ${ user.email } with activation link ${ verifyLink }`);

        let emailSendingConfig = {
              email: user.email
            , sLInk: verifyLink
            , sUrl: `${process.env.FRONT_BASE_URL}`
            , frontURL: `${URLS.FRONTEND}`
            , tcURL: `${process.env.FRONT_BASE_URL}terms-and-conditions`
        };
        console.log("emailSendingConfig = ", emailSendingConfig);

        /* Email delivery removed to expedite delivery
        await sendgrid.send(
            sendgrid.verification
            , emailSendingConfig
            , (error, result) => {
                if (error) return HttpResponse.serverErrorResponse("error", "Something Went Wrong At Send-Email", error);
                if (result) return HttpResponse.successResponse("success", "Verification email has been sent.");
            }
        );
        */

    } catch (error) {
        return HttpResponse.serverErrorResponse(res, "Something Went Wrong at Controller", error);
        throw error;
    }
};

// subscribe by emailId
exports.subscribe = async (req, res, next) => {
  try {
    const subscriberExist = await Subscriber.findOne({ where: req.body });
    if (subscriberExist) {
      return HttpResponse.successResponse(res, "Subscrber already exist!");
    }
    await Subscriber.create(req.body);
    return HttpResponse.successResponse(res, "Subscrber added succesfully");
  } catch (error) {
    return HttpResponse.serverErrorResponse(res, "Something went wrong!", error);
  }
};

// ---------------------------------------------------------------------------------------------- //
// ------------------------------------ PHASE 2 APIS -------------------------------------------- //
// ---------------------------------------------------------------------------------------------- //

exports.generateReferralLink = async (req, res, next) => {
    console.log('generateReferralLink(req, res, next)');

    try {

        //console.log('req.email = ' + req.email);
        console.log('req.params.email = ' + req.params.email);

        //const user = req.user;
        //console.log('user.email = ' + user.email);

        let email = req.params.email;

        const fetchUser = await User.findOne({
              //where: { id: user.id }
              where: { email: email }
            , attributes: ["id", "referralCode", "email"]
            , raw: true
        });
        if (!fetchUser) return HttpResponse.notFoundResponse(res, "User not found.");

        //const referralLink = `${process.env.FRONT_BASE_URL}?code=${fetchUser.referralCode}&id=${fetchUser.id}`;
        const referralLink = `${process.env.FRONT_BASE_URL}?referral-code=${fetchUser.referralCode}&id=${fetchUser.id}`;
        console.log('referralLink = ' + referralLink);

        return HttpResponse.successResponse(res, "Referral link generated", referralLink);
    } catch (error) {
        console.log("Link Generation Error:==>", error);
        return HttpResponse.serverErrorResponse(res, "Something went wrong!", error);
    }
};
