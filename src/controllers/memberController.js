const Member = require('../models/Member');

const memberController = {
  getMember: async (req, res) => {
    try {
      const members = await Member.find();
      return res.status(200).json({
        success: true,
        message: 'Get members successfully',
        data: members,
      });
    } catch (err) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = memberController;
