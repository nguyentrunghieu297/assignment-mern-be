const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = require('express').Router();

// [POST] /auth/register
router.post('/register', authController.registerUser);

// [GET] /auth/account
router.get('/account', authController.getCurrentUser);

// [POST] /auth/login
router.post('/login', authController.loginUser);

// [POST] /auth/logout
router.post('/logout', authController.logOut);

// [POST] /auth/refresh
router.post('/refresh', authController.requestRefreshToken);

module.exports = router;
