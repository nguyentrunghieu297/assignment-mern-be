const router = require('express').Router();
const watchController = require('../controllers/watchController');
const { verifyTokenAndAdmin } = require('../middleware/auth');

// [POST] /watch
router.post('/', verifyTokenAndAdmin, watchController.createWatch);
// [GET] /watch
router.get('/', watchController.getWatch);
// [GET] /watch/:id
router.get('/:id', watchController.getWatchById);
// [PUT] /watch/:id
router.put('/:id', verifyTokenAndAdmin, watchController.updateWatch);
// [DELETE] /watch/:id
router.delete('/:id', verifyTokenAndAdmin, watchController.deleteWatch);

// [GET] /watch/:id/comment
router.post('/:id/comment');

module.exports = router;
