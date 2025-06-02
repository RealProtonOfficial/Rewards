const { check } = require('express-validator');
const { loginAdmin, logOutUser, requestUserPasswordReset, resetUserPassword, verifyTOTPcode, signUpAdmin, changePassword } = require('../controllers/adminAuth');
const response = require('../utilities/response');
const { requestValidator } = require('../middlewares/errorHandler');
const { NotificationEventTypes } = require('../constants/events');
const { checkPasswordValidation } = require('../utilities/passwordValidation');
const { filterObject } = require('../utilities/stringUtils');
const permData = require('../config/permission.json');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { PERMISSIONS: { MODULE } } = require('../constants/permissions')

/**
 * Express route for logging in a user
 *
 * @param req Request from Express
 * @param res Response from Express
 */
exports.loginMiddleware = [
      check('email').not().isEmpty()
    , check('password').not().isEmpty()
    , requestValidator
];

exports.login = (req, res, next) => {
    console.log('routes/adminAuth: login(req, res, next)');

    const bodyData = req.body;
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    console.log(`email = ${ email }`);
    console.log('email = ', email);

    bodyData.permission = permData;
    const permissionObj = filterObject(bodyData.permission, ['analytic-dashboard', 'asset', 'auction', 'category', 'commission', 'news', 'order', 'sub-admin', 'transaction-history', 'user', 'customer-queries','rcommission'])

    bodyData.permission = permissionObj;
    loginAdmin(bodyData)
        .then((jwtToken) => response.successResponse(res, `You have logged in as ${jwtToken.role}`, jwtToken))
        .catch((error) => response.badRequestErrorResponse(res, error.message, error));
};

exports.logOutUser = async (req, res) => {
    try {
        const updateResponse = await logOutUser(req);
        if (updateResponse.success === false) throw new Error(updateResponse.message);
        else response.successResponse(res, 'User logout succesfully!', { adminId: req.params.id });
    } catch (error) {
        response.badRequestErrorResponse(res, error.message, error);
    }
};

/**
 * Express route for changing password from Admin login
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */

exports.changePasswordMiddleware = [
    check('oldPassword').not().isEmpty().withMessage("Please provide old password"),
    check('newPassword').not().isEmpty().withMessage("Please provide new password"),
    check('retypePassword').not().isEmpty().withMessage("Please confirm new password"),
    check('newPassword').custom(async (newPassword, { req }) => {
        if (newPassword !== req.body.retypePassword) {
            throw new Error('Retyped Password should be same as new Password');
        }
        if (newPassword === req.body.oldPassword) {
            throw new Error('Old and new passwords cannot be same');
        }
    })
    , requestValidator
];

exports.changeAdminPassword = async (req, res, next) => {
    try {
        const updateResponse = await changePassword(req);
        if (updateResponse.success === false) throw new Error(updateResponse.message);
        else response.successResponse(res, 'Password updated successfully', { adminId: req.params.id });
    } catch (error) {
        response.badRequestErrorResponse(res, error.message, error);
    }
};

/**
 * Express route for requesting a password reset
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
exports.forgotMiddleware = [
    check('email').not().isEmpty()
    , requestValidator
];

exports.forgotPassword = (req, res, next) => {
    //console.log('forgot(req, res, next)', req, res, next);
    console.log('forgotPassword(req, res, next)');
    //console.log('next = ', next);

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
            response.successResponse(res, 'Please check your email to continue resetting your password.', notification);
            */
            response.successResponse(res, 'Please check your email to continue resetting your password.');
        })
        //.catch((error) => next(error));
        //} catch (err) {
        .catch((error) => {

            console.log(error);
            console.log('error?.message = ', error?.message);
            //return response.serverErrorResponse(res'Error in adminAuth.js: forgot()', error);
            //return response.serverErrorResponse(res, error?.message, error?.message);
            //return response.badRequestErrorResponse(res, error?.message, [ error?.message ]);

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
            let errorMessage = 'Something went wrong in routes.adminAuth: forgotPassword()';
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
        });
};

/**
 * Express route for recovering a password
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
exports.recoverMiddleware = [
      check('token').not().isEmpty()
    , check('password').not().isEmpty()
    , requestValidator
];

exports.resetPassword = (req, res, next) => {
    console.log('routes/adminAuth: resetPassword(req, res, next)');

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
            //return response.serverErrorResponse(res, 'Error in routes/adminAuth: resetPassword(req, res, next)', error);
            //return response.serverErrorResponse(res, error?.message, error?.message);
            return response.badRequestErrorResponse(res, error?.message, [ error?.message ]);
        });
};

/**
 * Express route for recovering a password
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
exports.verifyQrMiddleware = [
  check('email').not().isEmpty(),
  check('otp').not().isEmpty(),
  requestValidator
];

exports.verifyQrOtp = (req, res, next) => {
  const email = req.body.email;
  const otp = req.body.otp;

  verifyTOTPcode(email, otp)
    .then(response => res.json(response))
    .catch((error) => response.badRequestErrorResponse(res, error.message, error));
};


/**
 * Express route for sign-in a sub-admin
 *
 * @param req Request from Express
 * @param res Response from Express
 */
 exports.signUpMiddleware = [
  check('email').not().isEmpty().withMessage('Enter a valid email address'),
  check('password').not().isEmpty().withMessage('Please fill the password fields'),
  check('confirmpassword').not().isEmpty().withMessage('Please fill the confirm password fields'),
  check('firstName').not().isEmpty().withMessage('Please fill the firstname fields'),
  check('lastName').not().isEmpty().withMessage('Please fill the lastname fields'),
  check('permission').not().isEmpty().withMessage('Please selects the permissions'),
  requestValidator
];

exports.signUp = async (req, res, next) => {
  const permission = await checkPermission(req.adminUser.roleId, MODULE.SUB_ADMIN.ADD)
  console.log('Admin Permission:', permission)
  if (!permission || permission?.msg) {
    return response.authorizationErrorResponse(res, permission?.msg ? permission?.msg : 'User does not have permission to access this end point.')
  }
  const bodyData = req.body
  bodyData.email = req.body.email.toLowerCase();
  bodyData.email = bodyData.email.trim();
  bodyData.firstName = bodyData.firstName.trim();
  bodyData.lastName = bodyData.lastName.trim();

  if (bodyData.firstName === '') return response.validationErrorResponse(res, 'Firstname can not be empty string');
  if (bodyData.lastName === '') return response.validationErrorResponse(res, 'Lastname can not be empty string');
  if (bodyData.email === '') return response.validationErrorResponse(res, 'Email can not be empty string');
  if (bodyData.password !== bodyData.confirmpassword) return response.validationErrorResponse(res, 'Password and Confirm-Password does not matched');
  const pwdValidation = checkPasswordValidation(bodyData.password);
  if (!pwdValidation) {
    return response.badRequestErrorResponse(res, pwdValidation, {});
  }
  const permissionObj = filterObject(bodyData.permission, ['analytic-dashboard', 'asset', 'auction', 'category', 'commission', 'news', 'order', 'sub-admin', 'transaction-history', 'user', 'customer-queries','rcommission'])

  bodyData.permission = permissionObj

  signUpAdmin(bodyData)
    .then((jwtToken) => response.successResponse(res, 'Sub-admin registration successfully', jwtToken))
    .catch((error) => response.badRequestErrorResponse(res, error.message, error))
};
