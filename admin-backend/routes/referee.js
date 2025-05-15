const { check } = require('express-validator');
const { adminFetchSpecificAffiliates, adminFetchAllRewards, adminFetchAllBlockRewards ,downloadUserRewards} = require('../controllers/referee');
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

// exports.fetchAllReferee = async (req, res, next) => {
//     adminFetchAllReferee(req, res)
//         .then((commission) => response.successResponse(res, 'All referee details fetched.', commission))
//         .catch((error) => response.badRequestErrorResponse(res, error.message, error));
// };

/**
 * Express route fetching all affiliate of referee
 *
 * @param req Request from Express
 * @param res Response from Express
 */

exports.fetchUserAffiliate = async (req, res, next) => {
    const permission = await checkPermission(req.adminUser.roleId, MODULE.USER.VIEW)
    console.log('permission', permission)
    if (!permission || permission?.msg) {
        return response.authorizationErrorResponse(res, permission?.msg ? permission?.msg : 'User does not have permission to access this end point.')
    }
    const page = (req.query.page && req.query.page > 0) ? parseInt(req.query.page) : 1;
    const limit = (req.query.limit && req.query.limit > 0) ? parseInt(req.query.limit) : 10;
    const offset = page === 1 ? 0 : limit * (page - 1);

    const search = req.query.search;
    const level = Number(req.query.level);
    const userId = req.params.id;
    adminFetchSpecificAffiliates(page, limit, offset, search, level, userId, res);
};


/**
 * Express route for reward history of referee
 *
 * @param req Request from Express
 * @param res Response from Express
 */

 exports.fetchUserRewards = async (req, res, next) => {
    const permission = await checkPermission(req.adminUser.roleId, MODULE.USER.VIEW)
    console.log('permission', permission)
    if (!permission || permission?.msg) {
        return response.authorizationErrorResponse(res, permission?.msg ? permission?.msg : 'User does not have permission to access this end point.')
    }
    const page = (req.query.page && req.query.page > 0) ? parseInt(req.query.page) : 1;
    const limit = (req.query.limit && req.query.limit > 0) ? parseInt(req.query.limit) : 10;
    const offset = page === 1 ? 0 : limit * (page - 1);

    const search = req.query.search;
    // const level = Number(req.query.level);
    const userId = req.params.id;
    adminFetchAllRewards(limit, userId, res);
};

/**
 * Return CSV file for reward history of particular user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.downloadUserRewards = async (req, res, next) => {
    const permission = await checkPermission(req.adminUser.roleId, MODULE.ANANLYTIC_DASHBOARD.VIEW)
    console.log('permission', permission)
    if (!permission || permission?.msg) {
        return response.authorizationErrorResponse(res, permission?.msg ? permission?.msg : 'User does not have permission to access this end point.')
    }
    const userId = req.params.id;
    downloadUserRewards(userId, res);
};

/**
 * Express route for reward history of referee
 *
 * @param req Request from Express
 * @param res Response from Express
 */

 exports.fetchBlockedUserRewards = async (req, res, next) => {
    const permission = await checkPermission(req.adminUser.roleId, MODULE.USER.VIEW)
    console.log('permission', permission)
    if (!permission || permission?.msg) {
        return response.authorizationErrorResponse(res, permission?.msg ? permission?.msg : 'User does not have permission to access this end point.')
    }
    const page = (req.query.page && req.query.page > 0) ? parseInt(req.query.page) : 1;
    const limit = (req.query.limit && req.query.limit > 0) ? parseInt(req.query.limit) : 10;
    const offset = page === 1 ? 0 : limit * (page - 1);

    const search = req.query.search;
    adminFetchAllBlockRewards(page, limit, offset, req.query, res);
};
