const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendResponse = require("../helpers/send_response");
const fs = require('fs');
const path = require('path');
const common = require("../helpers/common");
const {
    create,
    find,
    findOne,
    updateOne,
    deleteOne, aggregation,
    countDocuments, insertmany
} = require("../helpers/query_helper");
const async = require('async');

const config = require('../config/config')


exports.signUp = async (req, res) => {

    const { userName, email, firstName, lastName, password, dob, role } = req.body;

    let insertData = {}

    try {

        let validator = await common.validateField(['userName', 'email', 'firstName', 'lastName', 'password', 'dob'], req.body);
        if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);


        let { data: userData } = await findOne('USERS', { email });

        if (!userData) {

            insertData['userName'] = userName;
            insertData['email'] = email;
            insertData['role'] = role;
            insertData['firstName'] = firstName;
            insertData['lastName'] = lastName;
            insertData['dob'] = dob;
            insertData['password'] = await bcrypt.hash(password, 12);

            let userNameData = await common.UserNameCheck(req.body, 'USERS');
            if (!userNameData) return sendResponse(res, false, '', "Username already taken!");

            let { status, data: empDataCreate } = await create('USERS', insertData);
            if (!status) return sendResponse(res, false, '', "Something wrong!");

            return sendResponse(res, true, '', "Signup Succesfully!")
        }
        else {
            return sendResponse(res, false, '', "Email already exists!")
        }

    }
    catch (err) {

        return sendResponse(res, false, '', 'Error Occured' + err.message)
    }

}

exports.login = async (req, res) => {

    const { findField, password } = req.body;

    try {

        let validator = await common.validateField(['findField', 'password'], req.body);
        if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);

        let { ipAddress, location, browser_name, os } = await common.getIPAddressLocation(req);

        let { data: userData } = await findOne('USERS', { $and: [{ $or: [{ email: findField }, { userName: findField }] }] }, { email: 1, password: 1, role: 1 });


        if (!userData) return sendResponse(res, false, '', 'Invalid email or username');

        let passCheck = await bcrypt.compare(password, userData.password);

        if (!passCheck) return sendResponse(res, false, '', 'Invalid password!');

        const accessToken = await jwt.sign({ userId: String(userData._id) }, config.jwtSecret, { expiresIn: '1h' });

        let logHistory = { userId: userData._id, ipAddress, location, browser_name, os, role: userData.role }


        let { status, data: logHistoryData } = await create('USER_LOG_HSTRY', logHistory);

        return sendResponse(res, true, accessToken, 'Login Successfully!')

    }
    catch (err) {

        return sendResponse(res, 501, '', 'Error Occured' + err.message)
    }

}

exports.taskManagement = async (req, res) => {

    let api = req.originalUrl;

    let { title, description, dueDate, _id, userId, completed } = req.body;

    try {
        console.log(api)
        if (api == '/tasks/add-task') {

            let validator = await common.validateField(['title', 'description', 'dueDate', 'userId'], req.body);
            if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);

            let { data: userExist } = await findOne('USERS', { _id: userId });
            if (!userExist) return sendResponse(res, false, '', "User not found!");

            let addTasks = await create('TASKS', req.body);
            if (!addTasks.status) return sendResponse(res, false, "", addTasks.message);
            return sendResponse(res, true, '', "Tasks added successfully");

        }

        else if (api == '/tasks/all-tasks-list') {

            let options = common.pagination(req.body);
            console.log("snjkslndsk", options)

            async.parallel({
                getData: async function () {
                    console.log("in")
                    const pipeline = [

                        { $sort: options.sort },
                        { $skip: options.skip },
                        { $limit: options.limit },
                        {
                            $lookup:

                            {
                                from: "ATATUS_USERS",
                                localField: "userId",
                                foreignField: "_id",
                                as: "userList",
                            },
                        },
                        {
                            $project: {

                                title: 1,
                                description: 1,
                                userId: 1,
                                dueDate: 1,
                                compeleted: 1,
                                userName: { "$arrayElemAt": ["$userList.userName", 0] },

                            }
                        }

                    ];

                    let data = await aggregation('TASKS', pipeline);
                    console.log(data)
                    if (!data) return [];
                    return data
                },
                getCount: async function () {
                    let count = await countDocuments('TASKS', {});
                    return count

                },
            }, function (err, results) {

                if (results.getData) return sendResponse(res, true, results.getData, "", results.getCount)
            });


        }

        else if (api == '/tasks/user-data-list') {

            let options = common.pagination(req.body);

            let findQuery = { role: { $ne: 'admin' } }

            async.parallel({
                getData: async function () {
                    let { data } = await find('USERS', findQuery, { userName: 1, email: 1, dob: 1, createdAt: 1 }, options); if (!data) return

                    return data
                },
                getCount: async function () {
                    let count = await countDocuments('USERS', findQuery);
                    return count

                },
            }, function (err, results) {

                if (results.getData) return sendResponse(res, true, results.getData, "", results.getCount)
            });


        }

        else if (api == '/tasks/get-single-task') {

            let validator = await common.validateField(['_id'], req.body);
            if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);

            let { data: taskData } = await findOne('TASKS', { _id }, {});
            if (!taskData) return sendResponse(res, false, '', 'No data Found!');
            return sendResponse(res, true, taskData);

        }


        else if (api == '/tasks/update-task') {

            let validator = await common.validateField(['_id',"completed"], req.body);
            if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);

            let { data: taskData } = await findOne('TASKS', { _id }, {});
            if (!taskData) return sendResponse(res, false, '', 'No tasks Found!');

            let { status: updStatus, data: taskUpd } = await updateOne('TASKS', { _id: taskData._id }, { $set: { completed } });
            if (!updStatus) return sendResponse(res, false, '', "Something wrong!");

            return sendResponse(res, true, "","Task Update Sucessfully");

        }

        else if (api == '/tasks/delete-task') {

            let validator = await common.validateField(['_id'], req.body);
            if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);

            let { data: taskData } = await findOne('TASKS', { _id }, {});
            if (!taskData) return sendResponse(res, false, '', 'No tasks Found!');

            let { status, data: taskDelete } = await deleteOne('TASKS', { _id: taskData._id }, { $set: { completed } });
            if (!status) return sendResponse(res, false, '', "Something wrong!");
            return sendResponse(res, true, "", "Task deleted successfully!");

        }

        else {

            return sendResponse(res, false, '', "No api Found!");

        }





    } catch (err) {

        return sendResponse(res, false, "", err.message);

    }

}

exports.myTasks = async (req, res) => {

    let { id: _id } = req.user;

    try {
        let validator = await common.validateField(['id'], req.user);
        if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);

        
        let options = common.pagination(req.body);

        let findQuery = {  userId: _id }

        async.parallel({
            getData: async function () {
                let { data } = await find('TASKS', findQuery, {  }, options); if (!data) return

                return data
            },
            getCount: async function () {
                let count = await countDocuments('TASKS', findQuery);
                return count

            },
        }, function (err, results) {

            if (results.getData) return sendResponse(res, true, results.getData, "", results.getCount)
        });


      

    } catch (err) {
        return sendResponse(res, false, "", err.message);

    }
}

exports.seedAdmin = async (req, res) => {


    let insertData = {}

    try {

        let { data: adminData } = await findOne('USERS', { role: 'admin' });

        if (adminData) return sendResponse(res, false, '', "Admin already exist");


        const file = path.join(__dirname, '../helpers/admindata.json');
        let seedData = await fs.readFileSync('./helpers/admindata.json', 'utf8');
        seedData = JSON.parse(seedData);
        const { userName, email, firstName, lastName, password, dob, role } = seedData;

        let validator = await common.validateField(['userName', 'email', 'firstName', 'lastName', 'password', 'dob'], seedData);
        if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);




        insertData['userName'] = userName;
        insertData['email'] = email;
        insertData['role'] = role;
        insertData['firstName'] = firstName;
        insertData['lastName'] = lastName;
        insertData['dob'] = dob;
        insertData['password'] = await bcrypt.hash(password, 12);

        let { status, data: empDataCreate } = await create('USERS', insertData);
        if (!status) return sendResponse(res, false, '', "Something wrong!");

        return sendResponse(res, true, '', "Admin data Seeded Succesfully!")


    }
    catch (err) {
        ('err: ', err);

        return sendResponse(res, 501, '', 'Error Occured' + err.message)
    }

}