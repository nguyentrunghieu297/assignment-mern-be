const router = require('express').Router();
const memberController = require('../controllers/memberController');
const {
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require('../middleware/auth');

// [GET] /member
router.get('/', verifyTokenAndAdmin, memberController.getMember);

// [GET] /member/:id
router.get('/:id');

// [PUT] /member/:id
router.put(
  '/:id',
  verifyTokenAndUserAuthorization,
  memberController.updateMember
);

// [DELETE] /member/:id
router.delete('/:id');

// [PUT] /member/:id
router.put(
  '/password/:id',
  verifyTokenAndUserAuthorization,
  memberController.changePassword
);

module.exports = router;
