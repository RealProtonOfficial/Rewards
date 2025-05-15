const { Referee, User, Wallet, Reward } = require('../models/index');
const response = require('../utilities/response');
const { getPagingDataNew } = require('../utilities/pagination');
const { Sequelize, Op } = require('sequelize');
const { off } = require('utilities/logger');
const CsvParser = require("json2csv").Parser;
const moment = require("moment");

// NOT USING
// exports.adminFetchAllReferee = async (req, res) => {
//     // fetch all Referee
//     // pagination
//     try {
//         const page = (req.query.page && req.query.page > 0) ? parseInt(req.query.page) : 1;
//         const limit = (req.query.limit && req.query.limit > 0) ? parseInt(req.query.limit) : 10;
//         const offset = page === 1 ? 0 : limit * (page - 1);

//         const search = req.query.search;
//         const where = {};

//         // if (search) {}

//         const fetchAll = await Referee.findAndCountAll({
//             where,
//             limit: limit,
//             offset: offset,
//             include: [{
//                 model: User,
//                 as: 'level1',
//                 attributes: ['id', 'email', 'firstName', 'lastName']
//             },
//             {
//                 model: User,
//                 as: 'level2',
//                 attributes: ['id', 'email', 'firstName', 'lastName']
//             },
//             {
//                 model: User,
//                 as: 'level3',
//                 attributes: ['id', 'email', 'firstName', 'lastName']
//             }]
//         });
//         if (fetchAll.length === 0) return response.notFoundResponse(res, "Referees details not found");

//         const result = getPagingData(fetchAll, page, limit);
//         return result;
//     } catch (error) {
//         console.log("RefereeManagement Error:==>", error);
//         return error;
//     }
// };

exports.adminFetchSpecificAffiliates = async (page, limit, offset, search, level, userId, res) => {
    // fetch Referee -done
    // pagination - done
    // filter for affiliates level1,level2,level3 - done
    // total commission of every referee - done
    // current balance of every user - done
    try {
        const where = {};
        let attributes = [];

        // if (search) {}
        if (!level) {
            where[Op.or] =
                [
                    {
                        rLevel1: userId,
                    },
                    {
                        rLevel2: userId,
                    },
                    {
                        rLevel3: userId,
                    }
                ];
                attributes = ['id', 'userId', 'rLevel1', 'rLevel2', 'rLevel3', 'createdAt'];
        };

        // For Level 1 Where & Attributes
        if (level === 1) {
            where.rLevel1 = userId;
            attributes = ['id', 'userId', 'rLevel1', 'createdAt'];
        };
        // For Level 2 Where & Attributes
        if (level === 2) {
            where.rLevel2 = userId;
            attributes = ['id', 'userId', 'rLevel2', 'createdAt'];
        };
        // For Level 3 Where & Attributes
        if (level === 3) {
            where.rLevel3 = userId;
            attributes = ['id', 'userId', 'rLevel3', 'createdAt'];
        };
        console.log("Where", where);
        console.log("Attributes:", attributes);
        const fetchAll = await Referee.findAndCountAll({
            where,
            limit: limit,
            offset: offset,
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'userName', 'email', 'profilePicUrl', 'walletId', 'createdAt']
            }],
            attributes: attributes
        });
        if (fetchAll.count === 0) return response.notFoundResponse(res, "Affiliates details not found");
        // need to fetch totalBalance and currentBalance from Wallet Table
        const walletDetails = await Wallet.findOne({ where: { userId: userId }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
        // fetchAll = {
        //     ...fetchAll.toJSON(),
        //     walletDetails,
        // };
        // may be need to calculate balance based on selection
        let result = getPagingDataNew(fetchAll, page, limit, 'affiliates');
        result = {
            ...result,
            walletDetails,
        };
        return response.successResponse(res, "Affiliates details fetched", result);
    } catch (error) {
        console.log("AffiliateManagement Error:==>", error);
        return response.serverErrorResponse(res, "Something Went Wrong!");
    }
};

exports.adminFetchAllRewards = async (limit, userId, res) => {
    try {
        console.log("Reward History");
        const fetchAll = await Reward.findAll({
            limit: 3,
            where: { referralId: userId },
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'userName', 'profilePicUrl',]
            },
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['updatedAt'] }
        });
        if (fetchAll.count === 0) return response.notFoundResponse(res, "Affiliates details not found");

        // const result = getPagingDataNew(fetchAll, page, limit, 'affiliates');
        return response.successResponse(res, "Reward history of referee fetched", fetchAll);
    } catch (error) {
        console.log("AffiliateManagement Error:==>", error);
        return response.serverErrorResponse(res, "Something Went Wrong!");
    }
};
/**
 * Download user Rewards history CSV file
 * @param {*} userId 
 * @param {*} res 
 * @returns 
 */
exports.downloadUserRewards = async ( userId, res) => {
    try {
        console.log("Reward History");
        let fetchAllRewards = await Reward.findAll({
            where: { referralId: userId },
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'userName', 'profilePicUrl',]
            },
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['updatedAt'] }
        });
        if (fetchAllRewards.length === 0) return response.notFoundResponse(res, "Affiliates details not found");
     
        const objects = [];
        fetchAllRewards.forEach((obj) => {
            const { id, assetName, level, assetAmount, commissionAmount, commissionPercentage, user, createdAt } = obj;
            const userName = user.userName;
            const dateUTC =  moment(createdAt).format('DD/MM/YYYY hh:mm A');
            objects.push({ Id: id, 'Asset Name': assetName, User: userName, Level: level, 'Asset Amount': assetAmount, 'Commision Amount': commissionAmount, 'Commision Percentage': commissionPercentage, 'Created At': dateUTC });
        });

        const csvParser = new CsvParser(objects);
        const csvData = csvParser.parse(objects);
        res.set('Content-Disposition', ["attachment; filename=", 'order_' + Date.now(), '.csv'].join(''));
        res.end(csvData);
        return res;

    } catch (error) {
        console.log("AffiliateManagement Error:==>", error);
        return response.serverErrorResponse(res, "Something Went Wrong!");
    }
};


exports.adminFetchAllBlockRewards = async (page, limit, offset, query, res) => {
    try {
        console.log("Blocked Users Reward History");
        const level = Number(query.level);
        const findQuery = { adminReceived: true };
        if (level === 1) {
            findQuery.level = 'level-1';
        };
        if (level === 2) {
            findQuery.level = 'level-2';
        };
        if (level === 3) {
            findQuery.level = 'level-3';
        };
        const fetchAll = await Reward.findAndCountAll({
            where: findQuery,
            limit: limit,
            offset: offset,
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'userName', 'profilePicUrl']
            }, {
                model: User,
                as: 'referral',
                attributes: ['id', 'userName', 'walletId', 'isDeleted', 'isBlock']
            }],
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['updatedAt'] }
        });
        if (fetchAll.count === 0) return response.notFoundResponse(res, "Reward details not found");

        // const result = getPagingDataNew(fetchAll, page, limit, 'affiliates');
        const result = getPagingDataNew(fetchAll, page, limit, 'rewards');
        return response.successResponse(res, "Blocked users rewards fetched", result);
    } catch (error) {
        console.log("Blocked Users Reward Error:==>", error);
        return response.serverErrorResponse(res, "Something Went Wrong!");
    }
};