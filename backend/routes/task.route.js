// NPM
const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, res, cb) => {
        cb(null, Date.now())
    }
})


// CONTROLLERS

const { isOriginVerify, authenticateJWT } = require('../helpers/origin_check');
const { signUp, login, myTasks, seedAdmin, taskManagement } = require('../controller/user-controller');


router.post('/signup', signUp);

router.post('/login', login);

router.get('/admin-seed', seedAdmin);

router.post(['/add-task','/user-data-list', '/all-tasks-list', '/get-single-task','/update-task','/delete-task'], authenticateJWT('admin'), taskManagement);

router.post('/my-tasks', authenticateJWT(''), myTasks);

module.exports = router;