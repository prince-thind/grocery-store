const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');

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
      // const categories = results.categories.map((cat) => ({
      //   ...cat,
      //   count: 0,
      // }));
  
      for (const category of results.categories) {
        if(category.count===undefined){
          category.count=0;
        }
        for (const item of results.items) {
          if(item.category==null) continue;
          if (item.category.toString() === category._id.toString()) {
            category.count++;
          }
        }
      }
      res.render('category_list',{
        title:'Category List',
        categories:results.categories
      })
    }
  );
};

exports.category_detail = function (req, res, next) {
  res.send('NOt Impleneted: category details');
};

exports.category_create_get = function (req, res, next) {
  res.send('NOt Impleneted: category create get');
};

exports.category_create_post = function (req, res, next) {
  res.send('NOt Impleneted: category create post');
};

exports.category_update_get = function (req, res, next) {
  res.send('NOt Impleneted: category update_get');
};
exports.category_update_post = function (req, res, next) {
  res.send('NOt Impleneted: category update_post');
};
exports.category_delete_get = function (req, res, next) {
  res.send('NOt Impleneted: category delete_get');
};
exports.category_delete_post = function (req, res, next) {
  res.send('NOt Impleneted: category delete_post');
};
