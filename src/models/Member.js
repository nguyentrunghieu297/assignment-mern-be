const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, min: 6, max: 20 },
    password: { type: String, required: true, min: 6 },
    name: { type: String, required: true },
    dob: { type: Date, default: Date.now() },
    isAdmin: { type: Boolean, default: false },
    profilePic: {
      type: String,
      default:
        'https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);
