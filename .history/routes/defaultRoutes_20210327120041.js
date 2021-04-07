const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');

router.route('/')
    .get(defaultController.index);

router.route('/loginGet')
    .get(defaultController.loginGet)
    .post(defaultController.loginPost)

//router.route('/register')
    //.get(defaultController.register);

module.exports = router;