const { ReferralManagement } = require('../models/index');
const response = require('../utilities/response');

exports.adminAddReferralCommission = async (req, res) => {
    try {
        const { v1, v2, v3 } = req.body;
        if (typeof (v1) !== 'number' || typeof (v2) !== 'number' || typeof (v2) !== 'number') return response.validationErrorResponse(res, 'Please enter integer value');
        const value1 = parseInt(v1);
        const value2 = parseInt(v2);
        const value3 = parseInt(v3);
        if (value1 < 0 || value2 < 0 || value3 < 0) return response.validationErrorResponse(res, 'Please enter value more-than zero');
        if (value1.toString().length >= 3 || value2.toString().length >= 3 || value3.toString().length >= 3) return response.validationErrorResponse(res, 'Please enter less-than three digit');
        // LEVEL-1 COMMISSION
        const level1Commission = await ReferralManagement.findOne({ where: { type: "level1" } });
        if (level1Commission) {
            await ReferralManagement.update({ commission: value1 }, {
              where: { type: "level1" }
            });
            console.log('Level-1 Commission Updated');
        } else {
            await ReferralManagement.create({ type: "level1", commission: value1 });
            console.log('Level-1 Commission Updated');
        }
          // LEVEL-2 COMMISSION
          const level2Commission = await ReferralManagement.findOne({ where: { type: "level2" } });
          if (level2Commission) {
            await ReferralManagement.update({ commission: value2 }, {
              where: { type: "level2" }
            });
            console.log('Level-2 Commission Updated');
        } else {
            await ReferralManagement.create({ type: "level2", commission: value2 });
            console.log('Level-2 Commission Updated');
        }
          // LEVEL-3 COMMISSION
          const level3Commission = await ReferralManagement.findOne({ where: { type: "level3" } });
          if (level3Commission) {
            await ReferralManagement.update({ commission: value3 }, {
              where: { type: "level3" }
            });
            console.log('Level-3 Commission Updated');
        } else {
            await ReferralManagement.create({ type: "level3", commission: value3 });
            console.log('Level-3 Commission Updated');
        }
    } catch (error) {
        console.log("ReferralManagement Error:==>", error);
        return response.serverErrorResponse(res, 'Something Went Wrong !', error);
    }
};

exports.adminFetchAllReferralCommission = async (req, res) => {
  try {
    const commissionDetails = await ReferralManagement.findAll({});
    return commissionDetails;
  } catch (error) {
    console.log("ReferralManagement Error:==>", error);
    return response.serverErrorResponse(res, 'Something Went Wrong !', error);
  }
};