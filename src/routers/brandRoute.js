const router = require('express').Router();
const brandController = require('../controllers/brandController');
const { verifyTokenAndAdmin } = require('../middleware/auth');

// [GET] /brand
router.get('/', brandController.getBrand);

// [GET] /brand/:id
router.get('/:id', verifyTokenAndAdmin, brandController.getBrandById);

// [POST] /brand
router.post('/', verifyTokenAndAdmin, brandController.createBrand);

// [PUT] /brand/:id
router.put('/:id', verifyTokenAndAdmin, brandController.updateBrand);

// [DELETE] /brand/:id
router.delete('/:id', verifyTokenAndAdmin, brandController.deleteBrand);

module.exports = router;
