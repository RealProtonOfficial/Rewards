'use strict';

const HttpResponse = require('../../utilities/HttpResponse');
const { User, Referee, Reward, Wallet } = require('../../models/index');
const { Op } = require('sequelize');

/**
   * This file contains controllers of affiliates details.

   * @function { fetchAllAffiliates } is for fetching affiliates of user who joined platform using his referralCode.
   * @function { fetchAllRewards } is for fetching reward details of user who got commission from his affiliates purchase.
   *
*/

exports.fetchAllAffiliates = async (req, res) => {
    console.log('fetchAllAffiliates(req, res)');

    try {

        //const user = req.user;
        //console.log('    user = ', user);
        //let userId = user.id;

        let email = req.query.email;
        let userId = req.query.userId;
        console.log('    userId = ', userId);
        console.log('    email = ', email);
        const page = (req.query.page && req.query.page > 0) ? parseInt(req.query.page) : 1;
        const limit = (req.query.limit && req.query.limit > 0) ? parseInt(req.query.limit) : 10;
        const offset = page === 1 ? 0 : limit * (page - 1);
        const search = req.query.search;
        const level = Number(req.query.level);
        const where = {};
        let attributes = [];

        if (search) {}
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
        console.log('    where', where);
        console.log('    attributes', attributes);

        const fetchAll = await Referee.findAndCountAll({
            where,
            limit: limit,
            offset: offset,
            include: [{
                model: User,
                as: 'user',
                attributes: [
                    'id'
                    , 'userName'
                    , 'email'
                    //, 'profilePicUrl'
                    , 'createdAt'
                ]

            }],
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        if (fetchAll.count === 0) return HttpResponse.notFoundResponse(res, "No referred affiliates found.");
        let totalPages = Math.ceil(fetchAll.count / limit);
        totalPages = {
            ...fetchAll,
            totalPages
        };
        return HttpResponse.successResponse(res, 'Affiliates Fetched Successfully', totalPages);
    } catch (error) {
        console.error(error);
        return HttpResponse.serverErrorResponse(res, 'Something Went Wrong at Controller', error);
    }
};

exports.fetchAllRewards = async (req, res) => {
    console.log('modules/referee/controllers.fetchAllRewards(req, res)');

    try {

        //const user = req.user;
        //console.log('user.id = ', user.id);
        //let userId = user.id;

        let email = req.query.email;
        let userId = req.query.userId;
        console.log('    userId = ', userId);
        console.log('    email = ', email);
        const page = (req.query.page && req.query.page > 0) ? parseInt(req.query.page) : 1;
        const limit = (req.query.limit && req.query.limit > 0) ? parseInt(req.query.limit) : 10;
        const offset = page === 1 ? 0 : limit * (page - 1);
        const level = Number(req.query.level);
        const findQuery = { referralId: userId };

        console.log('page = ', page);
        console.log('limit = ', limit);
        console.log('offset = ', offset);
        console.log('level = ', level);

        if (level === 1) {
            findQuery.level = 'level-1';
        };
        if (level === 2) {
            findQuery.level = 'level-2';
        };
        if (level === 3) {
            findQuery.level = 'level-3';
        };
        console.log('findQuery = ', findQuery);

        const fetchAll = await Reward.findAndCountAll({
            where: findQuery,
            include: {
                model: User,
                as: 'user',
                attributes: [
                    'id'
                    , 'userName'
                    //, 'profilePicUrl'
                ]
            },
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['updatedAt'] }
        });
        console.log('fetchAll = ', fetchAll);
        if (fetchAll.count === 0) return HttpResponse.notFoundResponse(res, "No reward history found.");

        let totalPages = Math.ceil(fetchAll.count / limit);
        console.log('totalPages = ', totalPages);
        totalPages = {
              ...fetchAll
            , totalPages
        };
        return HttpResponse.successResponse(res, "Reward history of user fetched", totalPages);
        
    } catch (error) {
        return HttpResponse.serverErrorResponse(res, 'Something Went Wrong at Controller', error);
    }
};
