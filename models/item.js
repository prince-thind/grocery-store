const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    maxlength: 50,
    minlength: 2,
    required: true,
  },

  dsecription: { type: String, maxlength: 200 },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  price: { type: Number, max: 50000, required: true },
  inStock: { type: Boolean, require: true },
});

ItemSchema.virtual('url').get(function () {
  return '/item/' + this._id;
});

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
