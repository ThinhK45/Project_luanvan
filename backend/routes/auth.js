const express = require('express');
const router = express.Router();

//import validators
const authValidator = require('../validators/auth');
const { validateHandler } = require('../helpers/validateHandler');

//import controllers
const {
    signup,
    signin,
    forgotPassword,
    changePassword,
    isAuth,
    refreshToken,
    signout,
    createToken,
} = require('../controllers/auth');
const { userById } = require('../controllers/user');
const {
    sendChangePasswordEmail,
} = require('../controllers/email');
//routes
router.post('/signup', authValidator.signup(), validateHandler, signup);
router.post(
    '/signin',
    authValidator.signin(),
    validateHandler,
    signin,
    createToken,
);

router.post('/signout', signout);
router.post('/refresh/token', refreshToken);
router.post(
    '/forgot/password',
    authValidator.forgotPassword(),
    validateHandler,
    forgotPassword,
    sendChangePasswordEmail,
);
router.put(
    '/change/password/:forgotPasswordCode',
    authValidator.changePassword(),
    validateHandler,
    changePassword,
);
//router params
router.param('userId', userById);

module.exports = router;
