'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {
      isAuthorized
    , userAuthSignature 
    , checkProfileData
    , checkQuery
    , checkSubscriber
} = require('../middlewares/user');

const {
      generateReferralLink
    , registerUser
    , logOutUser
    , getProfile
    , verifyEmail
    , authSignature
} = require('../controllers/user');

const {
      fetchAllAffiliates
    , fetchAllRewards
} = require('../modules/referee/controllers');


// Routes

router.post('/user/register-user', registerUser);
router.get('/user/verify-email', verifyEmail);
router.post('/user/authenticate', [userAuthSignature], authSignature);
router.get('/user/referralLink/:email', generateReferralLink);
router.get('/user/affiliates', fetchAllAffiliates);
router.get('/user/rewards/history', fetchAllRewards);

// Ping the application connection
router.get('/ping', (req, res) => {
    const data = {};
    data.name = `${process.env.SIGN_MESSAGE}`;
    console.log('Ping:', data);
    res.send(data);
});

module.exports = router;