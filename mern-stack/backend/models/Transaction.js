const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    dateOfSale: Date,
    sold: Boolean,
    category: String,
});

module.exports = mongoose.model('Transaction', transactionSchema);

const axios = require('axios');
const Transaction = require('./models/Transaction');

app.get('/initialize-database', async (req, res) => {
    try {
        const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.insertMany(data);
        res.send('Database initialized with seed data.');
    } catch (error) {
        res.status(500).send('Error initializing database.');
    }
});

app.get('/transactions', async (req, res) => {
    const { month, search = '', page = 1, perPage = 10 } = req.query;
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(`${month}-31`);

    const query = {
        dateOfSale: { $gte: startDate, $lte: endDate },
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } },
        ],
    };

    const transactions = await Transaction.find(query)
        .skip((page - 1) * perPage)
        .limit(Number(perPage));
    
    res.json(transactions);
});

app.get('/statistics', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(`${month}-31`);

    const totalSales = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lte: endDate }, sold: true } },
        { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    const soldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, sold: true });
    const unsoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, sold: false });

    res.json({
        totalSales: totalSales[0]?.total || 0,
        soldItems,
        unsoldItems,
    });
});
