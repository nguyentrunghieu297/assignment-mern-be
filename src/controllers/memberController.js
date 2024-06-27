const Member = require('../models/Member');
const bcrypt = require('bcrypt');

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

  // Update member
  updateMember: async (req, res) => {
    try {
      const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!member) {
        return res.status(404).json({
          success: false,
          message: 'Member not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Member has been updated successfully',
        data: member,
      });
    } catch (err) {
      res.status(500).json({ error: error.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      const member = await Member.findById(id);
      if (!member) {
        return res.status(404).json({
          success: false,
          message: 'Member not found',
        });
      }
      const isMatch = await bcrypt.compare(currentPassword, member.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }
      if (await bcrypt.compare(newPassword, member.password)) {
        return res.status(400).json({
          success: false,
          message: 'New password must be different from current password',
        });
      }

      const salt = await bcrypt.genSalt(10);
      member.password = await bcrypt.hash(newPassword, salt);
      await member.save();

      return res.status(200).json({
        success: true,
        message: 'Password has been changed successfully',
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

module.exports = memberController;
