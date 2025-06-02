const bcrypt = require('bcrypt');
const {
    PERMISSIONS: {
        ROLES: { SUPER_ADMIN, SUB_ADMIN }
    }
} = require('../constants/permissions');
const { AdminUser } = require('../models/index');
const { generateAccessToken } = require('../utilities/authentication');
const { createRole } = require('./role');
const { createPermission } = require('./permission');
const { loginSession, removeRedisToken } = require('utilities/redis');
const response = require('utilities/response');
const { checkPasswordValidation } = require('../utilities/passwordValidation');

exports.loginAdmin = data => {
    console.log('controllers/adminAuth: loginAdmin(data)');
    console.log('data = ', data);

    return new Promise(async (resolve, reject) => {
        let foundUser = null;
        let role = SUPER_ADMIN;
        const permissionData = data?.permission;
        delete data?.permission;
        try {
            foundUser = await AdminUser.findOne({
                where: { email: data.email },
                raw: true,
            });
            console.log({ foundUser });
        } catch (error) {
            console.log('error = ', error);
            console.error(error);
            return reject('Something went wrong!');
        }
        if (foundUser) {
            console.log('foundUser = ', foundUser);
            if (foundUser.email === data.email) {
                if (
                    (await bcrypt.compare(data.password, foundUser.password)) &&
                    foundUser.isDeleted === false
                ) {
                    loginSession(
                        {
                            adminUser: {
                                  id: foundUser.id
                                , email: foundUser.email
                                , role: foundUser.role
                            }
                        }
                        , tokenVal => {
                            if (!tokenVal) reject(new Error('Access token not created'));
                            console.log('Admin Token:', tokenVal);
                            // const tokenVal = await generateAccessToken('adminUser', { id: foundUser.id, email: foundUser.email, role: foundUser.role });
                            tokenVal.imageUrl = foundUser.thumbnailImageUrl;
                            tokenVal.firstName = foundUser.firstName;
                            tokenVal.lastName = foundUser.lastName;
                            tokenVal.role = foundUser.role;
                            return resolve(tokenVal);
                        }
                    );
                } else {
                  return reject(
                    new Error(`please enter the correct username and password`)
                  );
                }
            } else {
                return reject(new Error(`User not found`));
            }

        } else {

            const superAdmin = await AdminUser.findOne({
                  where: { role: 'super-admin' }
                , raw: true
            });

            if (superAdmin)
                return reject(
                    new Error(`please enter the correct username and password`)
                );

            const pwdValidation = checkPasswordValidation(data.password);
            if (!pwdValidation) {
                return reject(new Error(pwdValidation));
            }
            AdminUser.create({ ...data, role: 'super-admin', status: 'active' })
                .then(async savedUser => {
                    // role = role + '_' + savedUser.firstName.toLowerCase()
                    const roleSaved = await createRole({
                          roleName: savedUser.role
                        , roleDescription: savedUser.role
                    });
                    if (permissionData) {
                        await createPermission(
                            { permName: role, permission: permissionData }
                            , roleSaved.id
                        );
                    }
                    savedUser.roleId = roleSaved.id;

                    savedUser
                        .save()
                        .then(async saveUser => resolve(saveUser))
                        .catch(error => {
                          AdminUser.destroy({ where: { id: savedUser.id } });
                          return reject({
                            errorType: error.message,
                            error,
                            message: `Failed to sub-admin creation.`,
                            status: 400,
                          });
                        });
                    resolve(
                        await generateAccessToken('adminUser', {
                          id: savedUser.id,
                          email: savedUser.email,
                          role: savedUser.role,
                        })
                    );
                })
              .catch(error => {
                console.log('error', error);
                reject('Something went wrong!');
              });
        }
    });
};

exports.logOutUser = async (req, res) => {
  try {
    let isRemove = await removeRedisToken(req.header('Authorization'));
    return { success: true, message: 'User logout succesfully!' };
  } catch (error) {
    console.log(error, 'Authentication signature');
    return { success: false, message: error };
  }
};