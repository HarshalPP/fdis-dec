const SalesModel = require("../models/sales");
const stock = require("../models/Stock_M");
const salesreadymade = require("../models/salesreadymade");


exports.getSalesManger = async (req, res) => {
    const sales = await SalesModel.aggregate([
        { $unwind: "$products" },
    
        {
            $group:
            {
                _id: null,
                "Total Sales rate": { $sum: "$products.rate" },
                "countSales": { $sum: 1 }
            }
        }
    ]);
    const availableProduct = await stock.aggregate([
        {
            "$group":
            {
                "_id":
                    { "product": "$product" },
                "count":
                    { "$sum": 1 },
            }
        },
    ]);
    const soldProduct = await SalesModel.aggregate([
        { $unwind: "$products" },
        {
            $group:
            {
                _id: '$products.select_product',
                count: { $sum: 1 }
            }
        }
    ]);
    const readyProduct = await salesreadymade.aggregate([
        {
            "$group":
            {
                "_id":
                    { "select_product": "$select_product" },
                "count":
                    { "$sum": 1 },
            }
        }
    ]);
    res.json({
        "status": 200, "msg": 'data has been fetched',
        sales: sales, availableProduct, soldProduct, readyProduct
    });

};
