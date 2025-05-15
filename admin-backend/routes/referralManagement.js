const { check } = require('express-validator');
const { adminAddReferralCommission, adminFetchAllReferralCommission } = require('../controllers/referralManagement');
const { filterObject } = require('../utilities/stringUtils');
const response = require('../utilities/response');
const { requestValidator } = require('../middlewares/errorHandler');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { PERMISSIONS: { MODULE } } = require('../constants/permissions')
/**
 * Express route for admin create commission
 *
 * @param req Request from Express
 * @param res Response from Express
 */

exports.addReferralCommission = async (req, res, next) => {
    const permission = await checkPermission(req.adminUser.roleId, MODULE.REFERRALCOMMISSION.VIEW)
    console.log('permission', permission)
    if (!permission || permission?.msg) {
        return response.authorizationErrorResponse(res, permission?.msg ? permission?.msg : 'User does not have permission to access this end point.')
    }
    adminAddReferralCommission(req, res)
        .then((commission) => response.successResponse(res, 'Referral Commission Added', commission))
        .catch((error) => response.badRequestErrorResponse(res, error.message, error));
};

// /**
//  * Express route for admin fetch single commission
//  *
//  * @param req Request from Express
//  * @param res Response from Express
//  */
// exports.fetchCommission = (req, res, next) => {
//     const commissionId = req.params.id;

//     adminFetchCommission(commissionId)
//         .then((category) => response.successResponse(res, 'Fetch single commission successfully', category))
//         .catch((error) => response.badRequestErrorResponse(res, error.message, error));
// };

/**
 * Express route for admin fetch all commission
 *
 * @param req Request from Express
 * @param res Response from Express
 */
exports.fetchAllReferralCommission = async (req, res, next) => {
    const permission = await checkPermission(req.adminUser.roleId, MODULE.REFERRALCOMMISSION.VIEW)
    console.log('permission', permission)
    if (!permission || permission?.msg) {
        return response.authorizationErrorResponse(res, permission?.msg ? permission?.msg : 'User does not have permission to access this end point.')
    }
    adminFetchAllReferralCommission(req, res)
        .then((category) => response.successResponse(res, 'Fetch commissions successfully', category))
        .catch((error) => response.badRequestErrorResponse(res, error.message, error));
};

// /**
//  * Express route for admin update commission
//  *
//  * @param req Request from Express
//  * @param res Response from Express
//  */
// exports.commissionUpdate = (req, res, next) => {
//     const updateData = filterObject(req.body, ['commissionType', 'platformCommission']);

//     adminUpdateCommission(req.params.id, updateData)
//         .then((commission) => response.successResponse(res, 'Commission updated successfully', commission))
//         .catch((error) => response.badRequestErrorResponse(res, error.message, error));
// };
