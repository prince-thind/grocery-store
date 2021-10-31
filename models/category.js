const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    maxlength: 50,
    minlength: 2,
    required: true,
  },
  description: { type: String, maxlength: 200 },
});

CategorySchema.virtual('url').get(function () {
  return '/category/' + this._id;
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
