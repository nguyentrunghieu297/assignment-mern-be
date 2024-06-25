const Watch = require('../models/Watch');

const commentController = {
  addComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, content, author } = req.body;

      const watch = await Watch.findById(id);
      if (!watch) {
        return res.status(404).json({ message: 'Watch not found' });
      }

      const newComment = {
        rating,
        content,
        author,
      };

      watch.comments.push(newComment);
      await watch.save();

      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        comment: newComment,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getComments: async (req, res) => {
    try {
      const { id } = req.params;
      const watch = await Watch.findById(id).populate(
        'comments.author',
        'username'
      );
      if (!watch) {
        return res.status(404).json({ message: 'Watch not found' });
      }
      res.json(watch.comments);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const { id, commentId } = req.params;
      const watch = await Watch.findById(id);
      if (!watch) {
        return res.status(404).json({ message: 'Watch not found' });
      }
      watch.comments.id(commentId).remove();
      await watch.save();
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = commentController;
