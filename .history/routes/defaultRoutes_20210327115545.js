const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');

router.route('/')
    .get(defaultController.index);

router.route('/login')
    .get(defaultController.login)
    .post

//router.route('/register')
    //.get(defaultController.register);

module.exports = router;