const Brand = require('../models/Brand');
const Watch = require('../models/Watch');

const brandController = {
  getBrand: async (req, res) => {
    try {
      const brands = await Brand.find();
      res.status(200).json(brands);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBrandById: async (req, res) => {
    try {
      const brand = await Brand.findById(req.params.id);
      res.status(200).json(brand);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createBrand: async (req, res) => {
    try {
      const brand = new Brand(req.body);
      await brand.save();
      res.status(201).json(brand);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateBrand: async (req, res) => {
    try {
      const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(brand);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteBrand: async (req, res) => {
    try {
      const watch = await Watch.findOne({ brand: req.params.id });
      if (watch) {
        return res.status(400).json({
          success: false,
          message: 'Brand has been used in watch',
        });
      } else {
        await Brand.findByIdAndDelete(req.params.id);
        return res.status(200).json({
          success: true,
          message: 'Brand has been deleted successfully',
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = brandController;
