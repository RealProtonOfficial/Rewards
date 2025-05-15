'use strict';

const express = require('express');
const router = express.Router();

const {
  isAuthorized,
  userAuthSignature,
  checkProfileData,
  checkQuery,
  checkSubscriber
} = require('../middlewares/user');

const { validateCreateCardRequest } = require('../middlewares/circlePayment');

const {
      generateReferralLink
} = require('../controllers/user');

const { getCommission } = require('../controllers/commission');
const {
      fetchAllAffiliates
    , fetchAllRewards
} = require('../modules/referee/controllers');
var bodyParser = require('body-parser');

// User Routes

router.get('/user/referralLink', isAuthorized, generateReferralLink);

// Affiliates Route
router.get('/user/affiliates', isAuthorized, fetchAllAffiliates);
router.get('/user/rewards/history', isAuthorized, fetchAllRewards);

router.get('/commission', getCommission);

const { test } = require('../controllers/test');

// Ping the application connection
router.get('/ping', (req, res) => {
  const data = {};
  data.name = `${process.env.SIGN_MESSAGE}`;
  console.log('Ping:', data);
  res.send(data);
});

module.exports = router;
