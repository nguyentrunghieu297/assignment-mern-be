const Watch = require('../models/Watch');
const Brand = require('../models/Brand');
const mongoose = require('mongoose');

const watchController = {
  getWatch: async (req, res) => {
    try {
      const selectedBrandId = req.query.selectedBrandId || null;
      const searchQuery = req.query.searchQuery || null;

      let filter = {};

      if (selectedBrandId) {
        filter.brand = selectedBrandId;
      }

      if (searchQuery) {
        filter.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ];
      }

      const watches = await Watch.find(filter).populate('brand');

      res.status(200).json({
        success: true,
        data: watches,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getWatchById: async (req, res) => {
    try {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
      if (!isValidObjectId) {
        return res.status(400).json({ error: 'Invalid Object ID' });
      }
      const watch = await Watch.findById(req.params.id)
        .populate('brand')
        .populate({
          path: 'comments',
          populate: {
            path: 'author',
            model: 'Member',
            select: 'username',
          },
        });

      if (!watch) {
        return res.status(404).json({ error: 'Watch not found' });
      }
      res.status(200).json(watch);
      //   res.render('detail', { watch: mongooseToObject(watch) });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createWatch: async (req, res) => {
    try {
      const watch = new Watch(req.body);
      await watch.save();
      res.status(201).json(watch);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateWatch: async (req, res) => {
    try {
      const watch = await Watch.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!watch) {
        return res.status(404).json({
          success: false,
          message: 'Watch not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Watch has been updated successfully',
        data: watch,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteWatch: async (req, res) => {
    try {
      const watch = await Watch.findById(req.params.id).populate('brand');

      if (!watch) {
        return res.status(404).json({
          success: false,
          message: 'Watch not found',
        });
      }

      // Kiểm tra xem đồng hồ có liên kết với brand hay không
      if (watch.brand) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete watch with an associated brand',
        });
      }

      const watchDelete = await Watch.findByIdAndDelete(req.params.id);
      if (!watchDelete) {
        return res.status(404).json({
          success: false,
          message: 'Watch not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Watch has been deleted successfully',
        data: watchDelete,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

module.exports = watchController;
