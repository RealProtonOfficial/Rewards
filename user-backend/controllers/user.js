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

const sendgrid = require("../utilities/sendgrid");
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

//exports.requestUserPasswordReset = email => {
const requestUserPasswordReset = email => {
    console.log('controllers/user: requestUserPasswordReset(email)', email);

    return new Promise((resolve, reject) => {
        User.findOne({ where: { email: email.toLowerCase() } })
            .then(async user => {
                //console.log('AdminUser.findOne({ where: { email: '+email.toLowerCase()+' }}).then(): user = ', user);
                console.log('Users.findOne({ where: { email: '+email.toLowerCase()+' }}).then(async user => {');
                console.log('user.id = ', user.id);
                console.log('user.email = ', user.email);
                if (!user) {
                    reject(new Error(`User not found!`));
                } else {

                    const token = await generateToken();
                    console.log('token = ', token);
                    user.resetPasswordToken = token;
                    user.save().then(() => resolve({ token }));

                    //let resetLink = `${process.env.FRONT_BASE_URL}user/forgot-password/${token}`;
                    let resetLink = `${process.env.FRONT_BASE_URL}forgot-password-dialog/${token}`;
                    console.log('resetLink = ', resetLink);

                    const inviteObject = {
                        name: 'Test' 
                        , email: email
                        , token: token
                        //, link: `${process.env.ADMIN_FRONT_URL}/forgot-password/${token}`
                        , link: resetLink
                        , userName: 'Test'
                        //, sUser: `${firstName} ${lastName}`
                        , sUser: 'firstName lastName'
                        , sLink: resetLink
                        , sUrl: `${process.env.FRONT_BASE_URL}`
                        , frontURL: `${process.env.FRONT_BASE_URL}`
                        , tcURL: `${process.env.FRONT_BASE_URL}TermsAndConditions`
                    };
                    console.log('inviteObject = ', inviteObject);

                    try {
                        resetPasswordEvent(inviteObject);
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
            .catch(error => {
                console.log(error);
                console.error(error);
                //reject(new Error('Failed to update'));
                reject(new Error(`User not found!`));
            });
    });
};

const resetPasswordEvent = (inviteObject) => {
    console.log('controllers/user: resetPasswordEvent(inviteObject)', inviteObject);

    sendgrid.send(
          sendgrid.resetPassword
        , inviteObject
        , (err, data) => {
            console.log('err = ', err);
            console.log('data = ', data);
            if (err) {
                console.log(err);
                //return HttpResponse.serverErrorResponse(data, "Something went wrong at Send-email", err);
                throw err;
            }
        }
    );
};

exports.resetPassword = (req, res, next) => {
    console.log('controllers/user: resetPassword(req, res, next)');

    const password = req.body.password;
    const token = req.body.token;

    console.log('password = ', password);
    console.log('token = ', token);

    resetUserPassword(token, password)
        .then(response => res.json(response))
        //.catch((error) => next(error));
        .catch((error) => {
            console.log(error);
            console.log('error?.message = ', error?.message);
            //return HttpResponse.serverErrorResponse(res, 'Error in routes/adminAuth: resetPassword(req, res, next)', error);
            //return HttpResponse.serverErrorResponse(res, error?.message, error?.message);
            return HttpResponse.badRequestErrorResponse(res, error?.message, [ error?.message ]);
        });
};

/**
 * Recover a user password by their reset token and password
 *
 * @param token
 * @param password
 */
//exports.resetUserPassword = (token, password) => {
const resetUserPassword = (token, password) => {
    console.log('controllers/user: resetUserPassword("'+token+'", "'+password+'")');

    return new Promise(async (resolve, reject) => {
        User.findOne({ where: { resetPasswordToken: token } })
            .then(async user => {
                console.log('user = ', user);
                if (!user) {
                    //reject(new Error('Failed to update'));
                    //reject(new Error('The password reset token has been used already. Try resetting your password again.'));
                    reject(new Error('This password reset request has been used already. Try resetting your password again.'));
                } else {
                    const hash = await bcrypt.hash(password, 10);
                    console.log('password hash', hash);
                    user.password = hash;
                    user.resetPasswordToken = null;

                    user.save().then(newUser => {
                        console.log('newUser = ', newUser);
                        if (!newUser) {
                            reject(new Error('Failed to update the user\'s password in the database. '+ user.email));
                        } else {
                            resolve(newUser);
                        }
                    });
                }
            })
            //.catch(error => reject(new Error('Failed to creation.', error)));
            .catch((error) => {
                console.log(error);
                console.log('error?.message = ', error?.message);
                //return HttpResponse.serverErrorResponse(res, 'Error in routes/adminAuth: resetPassword(req, res, next)', error);
                //return HttpResponse.serverErrorResponse(res, error?.message, error?.message);
                //return HttpResponse.badRequestErrorResponse(res, error?.message, [ error?.message ]);
                reject(new Error('Failed to creation.', error));
        });
    });
};

exports.authSignature = async (req, res) => {
    try {
        const user = req.user;
        loginSession(
            { id: user.id, publicAddress: user.publicAddress, email: user.email }
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

                /*
                    Dermot: We shouldn't need to create a Referrer entry if there is no referrer.
                */
                } else {

                    levelPayload = {
                        userId: user.id // new user
                    };

                    // Create referrer entry for new user
                    await Referee.create(levelPayload);
                    console.log("New Referee: ", user.id);
                    // create user in and that store in referrerDetails
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

exports.updateProfile = async (req, res) => {
    console.log("updateProfile(req, res)");

    try {

        let user = req.user;
        console.log("user = ", user);
        
        const {
            firstName
            , lastName
            , email
            , userName
        } = req.body;

        console.log(
            firstName
            , lastName
            , email
            , userName
        );

        const findQuery = { id: user.id };
        var messageEmail = `User's Profile Updated`;
        let whereCondition = "";

        if (userName) {
            whereCondition = {
                id: { [Op.ne]: user.id },
                [Op.or]: [{ email }, { userName }],
            };
        } else {
            whereCondition = {
                id: { [Op.ne]: user.id },
                [Op.or]: [{ email }],
            };
        }

        const uniqueUser = await User.findOne({ where: whereCondition });
        console.log("uniqueUser = ", uniqueUser);

        if (uniqueUser) return HttpResponse.errorInResponse(res, "Username/Email already taken by existing user");

        if (email.trim() === "") return HttpResponse.validationErrorResponse(res, "Email can not be empty string");

        const updateQuery = {
              //firstName: slugify(firstName.trim())
              firstName: firstName.trim()
            //, lastName: slugify(lastName.trim())
            , lastName: lastName.trim()
            , email: email.trim()
            , userName: slugify(userName.trim())
        };
        console.log("updateQuery = ", updateQuery);

        if (email && user.email !== email) {

            const userExists = await User.findOne({ where: { email } });
            console.log("userExists = ", userExists);
            if (userExists) return HttpResponse.serverErrorResponse(res, "email already exist");

            updateQuery.status = "unverified";

            const secureTokenObject = await generateAccessToken(null, {
                  id: user.id
                , email: email
            });
            console.log("secureTokenObject = ", secureTokenObject);

            if (!secureTokenObject) return HttpResponse.accessErrorResponse(res,"Verification token not created");

            const sLink = `${URLS.BACKEND}user/verify-email?token=${ secureTokenObject.accessToken }`;
            console.log("sLink = ", sLink);

            sendgrid.send(
                sendgrid.verification
                , {
                      email: email
                    , userName: userName
                    , sUser: `${firstName} ${lastName}`
                    , sLink: sLink
                    , sUrl: `${process.env.FRONT_BASE_URL}`
                    , frontURL: `${process.env.FRONT_BASE_URL}`
                    , tcURL: `${process.env.FRONT_BASE_URL}TermsAndConditions`
                }
                , (err, data) => {
                    if (err) {
                        console.log(err);
                        return HttpResponse.serverErrorResponse(data, "Something went wrong at Send-email", err);
                    }
                }
            );

            messageEmail = `${messageEmail} And Verification email sent to this ${email}`;
            console.log("messageEmail", messageEmail);

        }

        await User.update(updateQuery, { where: findQuery });
        user = await User.findOne({ where: findQuery, raw: true });
        console.log("user = ", user);


        return HttpResponse.successResponse(res, messageEmail, user);
    } catch (error) {
        return HttpResponse.serverErrorResponse(res, "An error arose in controller/user.js", error);
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

        await sendgrid.send(
            sendgrid.verification
            , emailSendingConfig
            , (error, result) => {
                if (error) return HttpResponse.serverErrorResponse("error", "Something Went Wrong At Send-Email", error);
                if (result) return HttpResponse.successResponse("success", "Verification email has been sent.");
            }
        );

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

        const user = req.user;
        console.log('user.email = ' + user.email);

        const fetchUser = await User.findOne({
              where: { id: user.id }
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
