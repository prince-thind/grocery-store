require('dotenv').config();

const mongoose = require('mongoose');
const mongodb = process.env.MONGODB_URI;
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));

const categoryIDs = {};
const Category = require('./models/category');
const Item = require('./models/item');

main();

async function main() {
  await createCategories();
  await createItems();
  mongoose.connection.close((err) => {
    if (err) console.log(err);
    console.log('finished!');
  });
}

async function createCategories() {
  const promises = [];
  for (const category of getSampleCategories()) {
    promises.push(createCategory(category));
  }
  await Promise.all(promises);
}

async function createItems() {
  const promises = [];
  for (const item of getSampleItems()) {
    promises.push(createItem(item));
  }
  await Promise.all(promises);
}

async function createCategory(object) {
  return new Promise((resolve, reject) => {
    const category = new Category(object);
    category.save((err) => {
      if (err) reject(err);
      categoryIDs[object.name] = category._id;
      resolve();
    });
  });
}

async function createItem(object) {
  return new Promise((resolve, reject) => {
    const item = new Item(object);
    item.save((err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function getSampleCategories() {
  const sampleCategories = [
    {
      name: 'Snacks',
      description:
        'Salty and Crispy, these items include a whole range of casual Snacks items',
    },
    {
      name: 'Sweets',
      description: 'Sweets unsurprisingly includes a lot of sweets!',
    },
    {
      name: 'Fruits and Vegetables',
      description: 'Fresh Source of fruits and vegetables straight from farms',
    },
    {
      name: 'Foodgrains and Oil',
      description:
        'Everything related to grains and oil can be found in this category',
    },
    {
      name: 'Beverages',
      description: 'All Beverages can be found in this category',
    },
    {
      name: 'Household',
      description: 'A category for essential household items',
    },
    {
      name: 'Misc',
      description: 'Misc items',
    },
  ];

  return sampleCategories;
}
function getSampleItems() {
  const sampleItems = [
    {
      name: 'Apple',
      description: 'Apples!',
      category: categoryIDs['Fruits and Vegetables'],
      price: 80,
      inStock: true,
    },
    {
      name: 'Doritos',
      description: 'Doritos!',
      category: categoryIDs['Snacks'],
      price: 20,
      inStock: true,
    },
    {
      name: 'Chocolate',
      description: 'Chocolate!',
      category: categoryIDs['Sweets'],
      price: 100,
      inStock: true,
    },
    {
      name: 'Sunflower Oil',
      description: '',
      category: categoryIDs['Foodgrains and Oil'],
      price: 100,
      inStock: false,
    },
    {
      name: 'Coffee',
      description: '',
      category: categoryIDs['Beverages'],
      price: 5,
      inStock: true,
    },
    {
      name: 'Banana',
      description: 'Bananas!',
      category: categoryIDs['Fruits and Vegetables'],
      price: 50,
      inStock: true,
    },
    {
      name: 'Orange',
      description: 'Oranges!',
      category: categoryIDs['Fruits and Vegetables'],
      price: 50,
      inStock: true,
    },
    {
      name: 'Detergent',
      description: '',
      category: categoryIDs['Household'],
      price: 30,
      inStock: true,
    },
    {
      name: 'Battery Charger',
      description: '',
      category: categoryIDs['Misc'],
      price: 200,
      inStock: true,
    },
    {
      name: 'Weird Item',
      description: '',
      price: 30,
      inStock: true,
    },
  ];

  return sampleItems;
}
