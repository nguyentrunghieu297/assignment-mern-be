const router = require('express').Router();
const memberController = require('../controllers/memberController');
const { verifyTokenAndAdmin } = require('../middleware/auth');

// [GET] /member
router.get('/', verifyTokenAndAdmin, memberController.getMember);

// [GET] /member/:id
router.get('/:id');

// [PUT] /member/:id
router.put('/:id');

// [DELETE] /member/:id
router.delete('/:id');

module.exports = router;
