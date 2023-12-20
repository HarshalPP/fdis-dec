const sales = require("../models/sales");
const salesorder = require("../models/sales");
const mongoose = require('mongoose');
const moment = require('moment');
const {redisClient,isRedisConnected} = require('../config/redis')
var stock = require('../models/Stock_M');
const { all } = require("../routes/sales");




//create old 

// exports.create = async(req, res) => {
//     // Rest of the code will go here
//     try {

//         const user = new salesorder({
//         //oId:req.body.oId,
//         //clientId:req.body.clientId, // AUTO GENRATED ID FROM CLIENT DATA
//         //---------client data---------------
//         clientName: req.body.clientName,
//         firmName: req.body.firmName,
//         address: req.body.address,
//         city: req.body.city,
//         phone_no: req.body.phone_no,
//         //--------------order create----------
//         sales_id: req.body.sales_id,
//         sales_name: req.body.sales_name,
//         orderId: req.body.orderId,
//         currentDate: new Date().toISOString(),
//         deliveryDate: req.body.deliveryDate,
//         note: req.body.note,
//         orderstatus: req.body.orderstatus, // 1-red -> not start, 2-orange -> in process, 3-green -> complete
//         products: req.body.isOrderReady,
//         //--------production head data--------
//         ph_id: req.body.ph_id,
//         ph_name: req.body.ph_name,
//         process_bar: req.body.process_bar, 
//         //----------dispatch manager----------
//         smName: req.body.smName,
//         vehicleNum: req.body.vehicleNum,
//         dpDate: req.body.dpDate,
//         dpRecieved: req.body.dpRecieved,
//         dpPhone: req.body.dpPhone,
//         dpTotalWeight: req.body.dpTotalWeight
//         });
//           console.log(req.body.products.length)
//         for(var i=0;i<req.body.products.length;i++)
//        {
//         var product_name=req.body.products[i].select_product;
//         var company =req.body.products[i].company;
//         var grade=req.body.products[i].grade;
//         var topcolor=req.body.products[i].topcolor;
//         var coating =req.body.products[i].coating;
//         var temper=req.body.products[i].temper;
//         var guardfilm=req.body.products[i].guardfilm; 
//         var weight = req.body.products[i].weight;     
//         const  stock_data= await stock.find({$and :[{'product': product_name,'company':company,'grade':grade,'topcolor':topcolor,'coatingnum':coating,'temper':temper,'guardfilm':guardfilm}] });
//         console.log(stock_data);
//         console.log(stock_data[0].weight);
//         console.log(weight);

//         if(stock_data[0].weight >weight || stock_data[0].weight >0)
//         { 
//             const id= stock_data[0]._id;
//             const final_weight= stock_data[0].weight - weight;
//             console.log(final_weight);
//             var updatedStock = await stock.findOneAndUpdate({'_id':id},{$set:{'weight':final_weight}});
//             const newOrder = await user.save();
//             return res.status(201).json({ "status": 201, "msg": 'order sucessfully created',newOrder});
//         }
//         else
//         {
//             return res.status(403).json({ "status": 403, "msg": 'order  can not be placed'});   
//         }

//        }
    
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({"Status":400 ,"Message":"Somthing Went Wrong"});
//     }
// }
//
//Available Stock





exports.create = async (req, res) => {
    try {
        const data = (max) => {
            const newdata = Math.floor(Math.random() * max);
            console.log(newdata);
            return newdata;
        };
        // Replace max with a specific value when calling the function
        const result = data(1000000000000000); // Replace 100 with your desired max value
        
        // Create a new sales order instance
        const user = new salesorder({
            clientName: req.body.clientName,
            firmName: req.body.firmName,
            address: req.body.address,
            city: req.body.city,
            phone_no: req.body.phone_no,
            sales_id: req.body.sales_id,
            sales_name: req.body.sales_name,
            orderId: req.body.orderId | result,
            currentDate: new Date().toISOString(),
            deliveryDate: req.body.deliveryDate,
            note: req.body.note,
            orderstatus: req.body.orderstatus, // 1-red -> not start, 2-orange -> in process, 3-green -> complete
            products: req.body.products, // Assuming req.body.products is an array of products
            ph_id: req.body.ph_id,
            ph_name: req.body.ph_name,
            process_bar: req.body.process_bar,
            smName: req.body.smName,
            vehicleNum: req.body.vehicleNum,
            dpDate: req.body.dpDate,
            dpRecieved: req.body.dpRecieved,
            dpPhone: req.body.dpPhone,
            dpTotalWeight: req.body.dpTotalWeight
        });

        // Check stock availability for each product in the order
        for (const product of req.body.products) {
            const product_name = product.select_product;
            const company = product.company;
            const grade = product.grade;
            const topcolor = product.topcolor;
            const coating = product.coating;
            const temper = product.temper;
            const guardfilm = product.guardfilm;
            const weight = product.weight;

            const stock_data = await stock.findOne({
                product: product_name,
                company: company,
                grade: grade,
                topcolor: topcolor,
                coatingnum: coating,
                temper: temper,
                guardfilm: guardfilm
            });

            if (stock_data && stock_data.weight >= weight) {
                // Sufficient stock is available, update stock quantity
                stock_data.weight -= weight;
                await stock_data.save();
            } else {
                return res.status(403).json({ "status": 403, "msg": 'Order cannot be placed due to insufficient stock' });
            }
        }

        // Save the new sales order
        const newOrder = await user.save();
        return res.status(201).json({ "status": 201, "msg": 'Order successfully created', newOrder });

    } catch (err) {
        console.log(err);
        res.status(400).json({ "status": 400, "message": "Something Went Wrong" });
    }
}
              // Showing Empty data

// exports.availableStock = async (req, res) => {
//     try {
//         var product_name = req.query.product;
//         var company = req.query.company;
//         var grade = req.query.grade;
//         var topcolor = req.query.topcolor;
//         var coating = req.query.coatingnum;
//         var temper = req.query.temper;
//         var guardfilm = req.query.guardfilm;

//         const AvailabelStock = await stock.find({
//             $and: [
//                 {
//                     'product': product_name,
//                     'company': company,
//                     'grade': grade,
//                     'topcolor': topcolor,
//                     'coating': coating,
//                     'temper': temper,
//                     'guardfilm': guardfilm
//                 }
//             ]
//         });

//         console.log("Available stock is", AvailabelStock);

//         if (AvailabelStock.length === 0) {
//             res.json({ isAvailable: 'False', status: 400, Message: "Out Of Stock" });
//         } else {
//             res.json({ isAvailable: 'True', status: 200, Message: "Stock Available" });
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({ status: 400, Message: "Something Went Wrong" });
//     }
// }

//--------get----- aggregation-------------


exports.availableStock = async (req, res) => {
    try {
        const {
            product,
            company,
            grade,
            topcolor,
            coating, // Assuming it's 'coatingnum' in req.query
            temper,
            guardfilm
        } = req.query;

        // Construct a query object based on the provided parameters
        const query = {
            product,
            company,
            grade,
            topcolor,
            coating, // Map 'coatingnum' to 'coating' field
            temper,
            guardfilm
        };

        // Use the query to retrieve all data from the database
        const allStockData = await stock.find({});

        console.log("All stock data:", allStockData);

        // Filter the data based on the provided parameters
        const filteredData = allStockData.filter(data => {
            return (
                (!product || data.product === product) &&
                (!company || data.company === company) &&
                (!grade || data.grade === grade) &&
                (!topcolor || data.topcolor === topcolor) &&
                (!coating || data.coating === coating) &&
                (!temper || data.temper === temper) &&
                (!guardfilm || data.guardfilm === guardfilm)
            );
        });

        console.log("Filtered data:", filteredData);

        if (filteredData.length === 0) {
            res.status(400).json({ isAvailable: 'False', status: 400, message: "Out Of Stock" });
        } else {
            res.status(200).json({ isAvailable: 'True', status: 200, message: "Stock Available", filteredData });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Something Went Wrong" });
    }
};



exports.get = async(req, res) => {
    // Rest of the code will go here
    const orderList = await salesorder.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
        {
            $lookup: {
                from: 'clients',
                localField: 'oId',
                foreignField: 'firmName',
                as: 'orderdetails'
            }
        }
    ]).sort({_id:-1});
    res.json({ "status": 200, "message": 'data has been fetched', res: orderList });
}

// get
exports.get = async(req, res) => {
        // Rest of the code will go here
        const orderList = await salesorder.findById(req.params.id);
        if(orderList)
        {
            res.json({ "status": 200, "msg": 'data has been fetched', res: orderList });
        }else
        {
            res.json({ status:"400",message: "No Record found" });
        }
        
    }
    // put one
exports.edit = async(req, res) => {
    try {
        //update record from collection            
        var updatedUser;
        var status = "0";
        switch (req.body.updateType)
        {
            case 'batchUpdate':
                updatedUser = await salesorder.findOneAndUpdate({
                    _id: new mongoose.Types.ObjectId(req.params.id),
                    "products.productId": req.body.pid
                }, { $set: { "products.$.batch_list": req.body.products.batch_list, "orderstatus": "2" }},{multi: true });
                status = "2";
                break;

            case 'productionInUpdate':
                updatedUser = await salesorder.findOneAndUpdate({
                    _id: new mongoose.Types.ObjectId(req.params.id),
                    "products.productId": req.body.pid
                    }, {
                    $set: {
                        "products.$.pIn_id": req.body.products.pIn_id,

                        "products.$.productionincharge": req.body.products.productionincharge,
                        "products.$.assignDate": req.body.products.assignDate,
                        "products.$.completionDate": req.body.products.completionDate,
                        "products.$.phNote": req.body.products.phNote,
                        "orderstatus": "1"
                    }
                }, { multi: true });
                status = "1";
                break;
            
            case 'SalesManager':
                updatedUser = await salesorder.findOneAndUpdate(
                    {_id: new mongoose.Types.ObjectId(req.params.id)}, { $set: {
                        clientName: req.body.clientName,
                        firmName: req.body.firmName,
                        address: req.body.address,
                        city: req.body.city,
                        phone_no: req.body.phone_no,
                        sales_id: req.body.sales_id,
                        sales_name: req.body.sales_name,
                        orderId: req.body.orderId,
                        currentDate: new Date().toISOString(),
                        deliveryDate: req.body.deliveryDate,
                        note: req.body.note,
                        products: req.body.products,
                        ph_id: req.body.ph_id,
                        ph_name: req.body.ph_name,
                        process_bar: req.body.process_bar,
                        smName: req.body.smName,
                        vehicleNum: req.body.vehicleNum,
                        dpDate: req.body.dpDate,
                        dpRecieved: req.body.dpRecieved,
                        dpPhone: req.body.dpPhone,
                        dpTotalWeight: req.body.dpTotalWeight,
                        "orderstatus": "0" }},{multi: true });
                status = "0";
               
            break;  
            default:
                updatedUser = await salesorder.findById(req.params.id).exec();
                updatedUser.set(req.body);
                const updateSalesorder = await updatedUser.save();
                status = "3";
        }
        var updStatus = await salesorder.findById(req.params.id).exec();
        updStatus.set({ 'orderstatus': status });
        await updStatus.save();

        updatedUser = await salesorder.findById(req.params.id);
        res.status(201).json({ "status": 200, "msg": 'record sucessfully updated', res: updatedUser });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// delete
exports.delete = async(req, res) => {
        try {
            
         const user_data= await salesorder.findById(req.params.id);
          if(user_data){
            await salesorder.findById(req.params.id).deleteOne();
            res.json({ status:"200",message: "Record has been deleted " });
          }else
        {
         
         res.json({ status:"201",message: "No Record found" });
          }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }


    
    //pagination 
// exports.allRecords = async(req, res) => {
//     // Rest of the code will go here
//     try {
//         const resPerPage = 10; // results per page
//         const page = req.params.page || 1; // Page 
//         // const orderList = await salesorder.find().skip((resPerPage * page) - resPerPage).limit(resPerPage);  
//         const orderList = await salesorder.find().sort({ '_id': -1 });
//         res.json({ "status": 200, "msg": 'data has been fetched', res: orderList });
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// }


exports.allRecords = async (req, res) => {
 
    const key = "allUsers";

    try {
        if (redisClient.connected) {
            const cachedData = await new Promise((resolve, reject) => {
                redisClient.get(key, (err, cachedData) => {
                    if (err) {
                        console.error(`Redis Error: ${err}`);
                        reject({ error: 'Internal Server Error' });
                    } else {
                        resolve(cachedData);
                    }
                });
            });

            if (cachedData) {
                console.log('All Users data from cache', JSON.parse(cachedData));
                return res.json({ data: JSON.parse(cachedData) });
            }

            const allUsers = await salesorder.find();

            if (allUsers.length > 0) {
                // Store data in Redis with an expiration time (e.g., 1 hour)
                redisClient.setex(key, 3600, JSON.stringify(allUsers));
                console.log('All Users from database', allUsers);
                return res.json({ data: allUsers });
            } else {
                console.log('No users found in the database');
                return res.status(404).json({ error: 'No Users found' });
            }
        } else {
            console.error("Redis client is not connected");
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Unhandled Promise Rejection:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }


};

