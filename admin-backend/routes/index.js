const express = require('express');
const router = express.Router();
const { adminAuthenticator } = require('../middlewares/authenticator');
const {
      loginMiddleware
    , login
    , logOutUser
    , signUp
    , changePasswordMiddleware
    , changeAdminPassword
} = require('./adminAuth');
const { fetchAdminProfile, updateSubAdmin, updateProfileMiddleware, updateMiddleware } = require('./profile');
const { createCommission, addCommission, fetchCommission, commissionIndex, commissionUpdate } = require('./commissionManagement');
const { addReferralCommission, fetchAllReferralCommission } = require('./referralManagement');
const { fetchUserAffiliate, fetchUserRewards, fetchBlockedUserRewards, downloadUserRewards } = require('./referee');

const rateLimiterMiddleware = require('../utilities/rateLimiter');
const validators = require("../middlewares/validatore");

// Role Route
router.get('/admin/roles/dropdown/list', adminAuthenticator, role);

router.post('/admin/roles', adminAuthenticator, roleCreate);
router.get('/admin/roles', adminAuthenticator, roleIndex);
router.get('/admin/roles/:id', adminAuthenticator, roleFetch);
router.patch('/admin/roles/:id', adminAuthenticator, roleUpdate);

router.post('/admin/signUp', [signUpMiddleware, adminAuthenticator], signUp);
router.post('/admin/auth', [rateLimiterMiddleware, loginMiddleware], login);
router.post('/admin/auth/2FA/verify', verifyQrMiddleware, verifyQrOtp); // 2FA
router.post('/admin/auth/forgot-password', [rateLimiterMiddleware, forgotMiddleware], forgotPassword);
router.post('/admin/auth/reset-password', recoverMiddleware, resetPassword);
router.patch('/admin/auth/changeAdminPassword', adminAuthenticator, changePasswordMiddleware, changeAdminPassword);
router.get('/admin/auth/logout', adminAuthenticator, logOutUser);

//router.get('/admin/fetchAdminProfile', adminAuthenticator, fetch); // update it to fetch
router.get('/admin/fetch-admin', adminAuthenticator, fetchAdminProfile); // update it to fetchAdminProfile
router.patch('/admin/editAdminProfile', adminAuthenticator, updateMiddleware, updateAdminProfile);

/**
 * Express routes for getting all the category.Category heirarchy has been defined in this order
 * Category – Subcategory
 */

// Commission-management
router.get('/admin/commissions/order/list', adminAuthenticator, fetchOrders);
router.get('/admin/report/download', adminAuthenticator, reportIndex);

router.post('/admin/commissions', [adminAuthenticator, validators.validatecommisionReq], createCommission);
router.get('/admin/commissions/:id', adminAuthenticator, fetchCommission);
router.get('/admin/commissions', adminAuthenticator, commissionIndex);
router.patch('/admin/commissions/:id', adminAuthenticator, commissionUpdate);
router.post('/admin/addcommissions', adminAuthenticator, addCommission);

// Referral Management
// router.get('/admin/referral/commissions/:id', adminAuthenticator, );
router.get('/admin/referral/commissions', adminAuthenticator, fetchAllReferralCommission);
// router.patch('/admin/referral/commissions/:id', adminAuthenticator, );
router.post('/admin/referral/addcommissions', adminAuthenticator, addReferralCommission);

// Referee
router.get('/admin/affiliate/:id', adminAuthenticator, fetchUserAffiliate);

// Reward History
router.get('/admin/rewards/history/:id', adminAuthenticator, fetchUserRewards);
router.get('/admin/blocked/rewards/history', adminAuthenticator, fetchBlockedUserRewards);
router.get('/admin/rewards/download/:id', adminAuthenticator, downloadUserRewards);

// User
router.get('/admin/user/:userId', [adminAuthenticator], fetchUser);
router.get('/admin/user', [adminAuthenticator], userIndex);
router.patch('/admin/user/:id', [adminAuthenticator], userUpdate);
router.put('/admin/user/block/:id', [adminAuthenticator], userBlock);

// Ping the application connection
router.get('/ping', (req, res) => {
    const data = {};
    data.name = `${process.env.SIGN_MESSAGE}`;
    console.log("Ping:", data);
    res.send(data);
});
module.exports = router;
