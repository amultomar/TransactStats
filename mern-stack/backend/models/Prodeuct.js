const express = require('express');
const axios = require('axios');
const Product = require('../models/Product');
const router = express.Router();

// Initialize database with seed data from third-party API
router.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const products = response.data;

    await Product.deleteMany({});
    await Product.insertMany(products);
    res.status(200).send('Database initialized with seed data');
  } catch (err) {
    res.status(500).send('Error initializing database');
  }
});

// List all transactions with search and pagination
router.get('/', async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;

  const query = {
    $and: [
      { dateOfSale: { $regex: `^${month}`, $options: 'i' } },
      { $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: { $regex: search } }
      ]}
    ]
  };

  const products = await Product.find(query)
    .skip((page - 1) * perPage)
    .limit(parseInt(perPage));

  const totalProducts = await Product.countDocuments(query);

  res.status(200).json({ products, totalProducts });
});

// Statistics API
router.get('/statistics', async (req, res) => {
  const { month } = req.query;

  const soldItems = await Product.aggregate([
    { $match: { dateOfSale: { $regex: `^${month}`, $options: 'i' }, sold: true } },
    { $group: { _id: null, totalSold: { $sum: 1 }, totalAmount: { $sum: '$price' } } }
  ]);

  const notSoldItems = await Product.aggregate([
    { $match: { dateOfSale: { $regex: `^${month}`, $options: 'i' }, sold: false } },
    { $group: { _id: null, totalNotSold: { $sum: 1 } } }
  ]);

  res.status(200).json({
    totalAmount: soldItems[0]?.totalAmount || 0,
    totalSold: soldItems[0]?.totalSold || 0,
    totalNotSold: notSoldItems[0]?.totalNotSold || 0
  });
});

// Bar chart API
router.get('/bar-chart', async (req, res) => {
  const { month } = req.query;

  const priceRanges = [
    { $match: { dateOfSale: { $regex: `^${month}`, $options: 'i' } } },
    { $bucket: {
      groupBy: '$price',
      boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
      default: 'Other',
      output: { count: { $sum: 1 } }
    }}
  ];

  const result = await Product.aggregate(priceRanges);
  res.status(200).json(result);
});

// Pie chart API
router.get('/pie-chart', async (req, res) => {
  const { month } = req.query;

  const categories = await Product.aggregate([
    { $match: { dateOfSale: { $regex: `^${month}`, $options: 'i' } } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  res.status(200).json(categories);
});

// Combined API
router.get('/combined', async (req, res) => {
  const { month } = req.query;

  const transactions = await Product.find({ dateOfSale: { $regex: `^${month}`, $options: 'i' } });

  const statistics = await router.get('/statistics', { query: { month } });
  const barChartData = await router.get('/bar-chart', { query: { month } });
  const pieChartData = await router.get('/pie-chart', { query: { month } });

  res.status(200).json({ transactions, statistics, barChartData, pieChartData });
});

module.exports = router;
