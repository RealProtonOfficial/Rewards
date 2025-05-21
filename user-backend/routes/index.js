'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {
      isAuthorized
    , checkProfileData
    , checkQuery
    , checkSubscriber
} = require('../middlewares/user');

const {
      generateReferralLink
} = require('../controllers/user');

const {
      fetchAllAffiliates
    , fetchAllRewards
} = require('../modules/referee/controllers');

// User Routes

router.get('/user/referralLink', isAuthorized, generateReferralLink);

// Affiliates Routes
router.get('/user/affiliates', isAuthorized, fetchAllAffiliates);
router.get('/user/rewards/history', isAuthorized, fetchAllRewards);

// Ping the application connection
router.get('/ping', (req, res) => {
    const data = {};
    data.name = `${process.env.SIGN_MESSAGE}`;
    console.log('Ping:', data);
    res.send(data);
});

module.exports = router;