const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, maxlength: 50, minlength: 2, lowercase: true },
  description: { type: String, maxlength: 200, minlength: 2 },
});

CategorySchema.virtual('url').get(function () {
  return '/category/' + this._id;
});

const Category = mongoose.Model('category', CategorySchema);

module.exports = Category;
