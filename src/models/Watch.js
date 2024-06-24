const mongoose = require('mongoose');
const Brand = require('./Brand');

const commentSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 3, require: true },
    content: { type: String, require: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
  },
  { timestamps: true }
);

const watchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    comments: [commentSchema],
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Watch', watchSchema);
