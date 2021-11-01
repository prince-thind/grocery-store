const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = function (req, res, next) {
  async.parallel(
    {
      categories: function (callback) {
        Category.countDocuments({}, callback);
      },
      items: function (callback) {
        Item.countDocuments({}, callback);
      },
      itemsAvailable: function (callback) {
        Item.countDocuments({ inStock: true }, callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      const categoriesCount = results.categories;
      const itemsCount = results.items;
      const itemsAvailableCount = results.itemsAvailable;

      res.render('index', {
        title: 'Foo Groceries',
        categoriesCount,
        itemsCount,
        itemsAvailableCount,
      });
    }
  );
};

exports.category_list = function (req, res, next) {
  async.parallel(
    {
      categories: (callback) => Category.find().exec(callback),
      items: (callback) => Item.find().exec(callback),
    },
    function (err, results) {
      if (err) return next(err);

      for (const category of results.categories) {
        if (category.count === undefined) {
          category.count = 0;
        }
        for (const item of results.items) {
          if (item.category == null) continue;
          if (item.category.toString() === category._id.toString()) {
            category.count++;
          }
        }
      }
      res.render('category_list', {
        title: 'Category List',
        categories: results.categories,
      });
    }
  );
};

exports.category_detail = function (req, res, next) {
  const ID = req.params.id;
  async.parallel(
    {
      category: (callback) => Category.findById(ID, callback),
      items: (callback) => Item.find({ category: ID }).exec(callback),
    },
    function (err, results) {
      if (err) return next(err);
      res.render('category_detail', {
        title: 'category detail',
        category: results.category,
        items: results.items,
      });
    }
  );
};

exports.category_create_get = function (req, res, next) {
  res.render('category_form', {
    title: 'create category',
    name: '',
    description: '',
    errors: [],
  });
};

exports.category_create_post = [
  body('category_name')
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Category name must contain minimum 2 Characters')
    .isAlphanumeric()
    .withMessage('Category name cannot contain special characters'),
  body('category_description')
    .trim()
    .isLength({ max: 150 })
    .escape()
    .withMessage('Category Description must contain at max 150 Character')
    .isAlphanumeric()
    .withMessage('Category Description cannot contain special characters'),

  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('category_form', {
        errors: errors.array(),
        title: 'Create Category',
        name: req.body.category_name,
        description: req.body.category_description,
      });
      return;
    }

    const category = new Category({
      name: req.body.category_name,
      description: req.body.category_description,
    });
    category.save((err) => {
      if (err) return next(err);
      res.redirect('/categories');
    });
  },
];

exports.category_update_get = function (req, res, next) {
  const ID = req.params.id;
  Category.findById(ID).exec(function (err, category) {
    if (err) return next(err);
    if (category == null) {
      const error = new Error('category not found!');
      error.status = 404;
      return next(error);
    }
    res.render('category_form', {
      title: 'Update Form',
      name: category.name,
      description: category.description,
      errors: [],
    });
  });
};
exports.category_update_post = [
  body('category_name')
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Category name must contain minimum 2 Characters')
    .isAlphanumeric()
    .withMessage('Category name cannot contain special characters'),
  body('category_description')
    .trim()
    .isLength({ max: 150 })
    .escape()
    .withMessage('Category Description must contain at max 150 Character')
    .isAlphanumeric()
    .withMessage('Category Description cannot contain special characters'),

  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('category_form', {
        errors: errors.array(),
        title: 'Create Category',
        name: req.body.category_name,
        description: req.body.category_description,
      });
      return;
    }
    const ID = req.params.id;
    const category = new Category({
      name: req.body.category_name,
      description: req.body.category_description,
      _id: req.params.id,
    });
    Category.findByIdAndUpdate(ID, category, function (err, updatedCategory) {
      if (err) return next(err);
      res.redirect(updatedCategory.url);
    });
  },
];

exports.category_delete_get = function (req, res, next) {
  const ID = req.params.id;
  async.parallel(
    {
      category: (callback) => Category.findById(ID, callback),
      items: (callback) => Item.find({ category: ID }).exec(callback),
    },
    function (err, results) {
      if (err) return next(err);
      if (results.items.length != 0) {
        res.render('category_delete', {
          title: 'delete Category',
          items: results.items,
          category: results.category,
        });
      } else {
        res.render('category_delete', {
          title: 'delete Category',
          category: results.category,
        });
      }
    }
  );
};
exports.category_delete_post = function (req, res, next) {
  const ID = req.body.categoryid;
  async.parallel(
    {
      category: (callback) => Category.findById(ID, callback),
      items: (callback) => Item.find({ category: ID }).exec(callback),
    },
    function (err, results) {
      if (err) return next(err);
      if (results.items.length != 0) {
        res.render('category_delete', {
          title: 'delete Category',
          items: results.items,
          category: results.category,
        });
      } else {
        Category.findByIdAndDelete(ID,function(err){
          if(err) return next(err);
          res.redirect('/categories');
        })
        
      }
    }
  );
};
