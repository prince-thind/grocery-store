const Item = require('../models/item');


exports.item_list = function (req, res, next) {
  Item.find({}).exec(function(err,items){
    if(err) return next(err);
    res.render('item_list',{title:'Items List', items})
  })
};

exports.item_detail = function (req, res, next) {
    res.send('NOt Impleneted: item details');
  };

exports.item_create_get = function (req, res, next) {
  res.send('NOt Impleneted: item create get');
};

exports.item_create_post = function (req, res, next) {
  res.send('NOt Impleneted: item create post');
};

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
