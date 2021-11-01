const Item = require('../models/item');
const Category = require('../models/category');
const { body, validationResult } = require('express-validator');

exports.item_list = function (req, res, next) {
  Item.find({}).exec(function (err, items) {
    if (err) return next(err);
    res.render('item_list', { title: 'Items List', items });
  });
};

exports.item_detail = function (req, res, next) {
  const ID = req.params.id;
  Item.findById(ID)
    .populate('category')
    .exec(function (err, item) {
      if (err) return next(err);
      if (item == null) {
        const error = new Error('Item not found!');
        error.status = 404;
        return next(error);
      }
      res.render('item_detail', { title: 'Item Detail', item });
    });
};

exports.item_create_get = function (req, res, next) {
  Category.find().exec((err, categories) => {
    if (err) return next(err);
    res.render('item_form', { title: 'Create item', errors: [], categories });
  });
};

exports.item_create_post = [
  body('item_name')
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Item name must contain minimum 2 Characters')
    .isAlphanumeric()
    .withMessage('Item name cannot contain special characters'),
  body('item_description')
    .trim()
    .isLength({ max: 150 })
    .escape()
    .withMessage('Item Description must contain at max 150 Character')
    .isAlphanumeric()
    .withMessage('Item Description cannot contain special characters'),
  body('item_price')
    .trim()
    .escape()
    .isFloat({ max: 200000, min: 0.01 })
    .withMessage('Price Must lie within 200000 and 0')
    .isAlphanumeric()
    .withMessage('Price must be a number'),
  body('item_instock').isBoolean().withMessage('instock should be a boolean'),
  body('item_category', 'error in category')
    .trim()
    .isLength({ min: 2 })
    .escape()
    .isAlphanumeric(),
  function (req, res, next) {
    const errors = validationResult(req);
    Category.find().exec(function (err, categories) {
      if (err) return next(err);
      if (!errors.isEmpty()) {
        res.render('item_form', { errors: errors.array(),categories,item:{name:req.body.item_name,description:req.body.item_description,price:req.body.item_price,instock:req.body.item_instock,category:req.body.item_category} });
        return;
      }
      const item = new Item({
        name: req.body.item_name,
        description: req.body.item_description,
        price: req.body.item_price,
        instock: req.body.item_instock,
        category: req.body.item_category,
      });
      item.save((err) => {
        if (err) return next(err);
        res.redirect('/items');
      });
    });
  },
];

exports.item_update_get = function (req, res, next) {
  res.send('NOt Impleneted: item update_get');
};
exports.item_update_post = function (req, res, next) {
  res.send('NOt Impleneted: item update_post');
};
exports.item_delete_get = function (req, res, next) {
  res.send('NOt Impleneted: item delete_get');
};
exports.item_delete_post = function (req, res, next) {
  res.send('NOt Impleneted: item delete_post');
};
