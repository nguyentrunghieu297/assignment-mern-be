const router = require('express').Router();
const commentController = require('../controllers/commentController');
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

// [POST] /watch/:id/comment
router.post('/:id/comment', commentController.addComment);

// [GET] /watch/:id/comment
router.get('/:id/comment', commentController.getComments);

// [DELETE] /watch/:id/comment
router.delete('/:id/comment/:commentId', commentController.deleteComment);

module.exports = router;
