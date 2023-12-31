const sales = require("../models/sales");
const salesorder = require("../models/sales");
const mongoose = require('mongoose');
const moment = require('moment');
// const {redisClient,isRedisConnected} = require('../config/redis')
var stock = require('../models/Stock_M');
const { all } = require("../routes/sales");
const redisClient = require('../config/redis');

const eventEmitter = require('../utils/eventEmitter');
const admin = require('firebase-admin');
const serviceAccount = require('../config/fcm.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendPushNotification(deviceToken, message) {
    const payload = {
      notification: {
        title: 'Order Rejected',
        body: message,
      },
    };
  
    try {
      // Send FCM notification
      const response = await admin.messaging().sendToDevice(deviceToken, payload);
      // Log success or error
      if (response.results && response.results.length > 0) {
        const firstResult = response.results[0];
        if (firstResult.error) {
          console.error('FCM notification failed:', firstResult.error);
        } else {
          console.log('FCM notification sent successfully:', response);
        }
      }
    } catch (error) {
      console.error('Error sending FCM notification:', error);
    }
  }
  

// Listen for 'OrderRejected' event
eventEmitter.on('OrderRejected', async ({ salesPerson }) => {
  try {
    const { sales_name, sales_id } = salesPerson;
    const deviceToken = 'token';

    console.log(`Notification: Order for salesperson -->> ${sales_id} and  --> ${sales_name} is canceled. Notify Sales Manager.`);

    // Additional logic related to notifying the sales manager can be added here


    // Send FCM notification
    const message = `Order for salesperson ${sales_id} and ${sales_name} is canceled. Notify Sales Manager.`;
    await sendPushNotification(deviceToken, message);
  } catch (error) {
    console.error('Error handling OrderRejected event:', error);
  }
});





// const eventEmitter = require('../utils/eventEmitter');
// const admin=require("firebase-admin")
// const fcm=require("fcm-notification")
// const serviceAccount=require('../config/fcm.json')
// const certPath=admin.credential.cert(serviceAccount)
// const FCM = new fcm(certPath)
// const admin = require('firebase-admin');
// require('dotenv').config();

// // Use the GOOGLE_APPLICATION_CREDENTIALS environment variable
// process.env.GOOGLE_APPLICATION_CREDENTIALS = 'C:\\Users\\dear\\Desktop\\vss-dec\\inner-radius-401719-firebase-adminsdk-hl4z0-6c5ad46056.json';


// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   projectId: 'inner-redius-401719', // Replace with your actual project ID
// });

// async function sendPushNotification(deviceToken, message) {
//   const payload = {
//     notification: {
//       title: 'Order Rejected',
//       body: message,
//     },
//   };

//   try {
//     // Send push notification
//     await admin.messaging().sendToDevice(deviceToken, payload);
//     console.log(`Push notification sent successfully to device with token: ${deviceToken}`);
//   } catch (error) {
//     console.error('Error sending push notification:', error);
//   }
// }

// eventEmitter.on('OrderRejected', async ({ salesPerson }) => {
//   try {
//     const { sales_name, sales_id } = salesPerson;
//     const deviceToken = 'xz'; // Replace with the actual device token from the mobile app

//     console.log(`Notification: Order for salesperson -->> ${sales_id} and  --> ${sales_name} is canceled. Notify Sales Manager.`);

//     // Additional logic related to notifying the sales manager can be added here

//     // Send push notification
//     const message = `Order for salesperson ${sales_id} and ${sales_name} is canceled. Notify Sales Manager.`;
//     await sendPushNotification(deviceToken, message);
//   } catch (error) {
//     console.error('Error handling OrderRejected event:', error);
//   }
// });

// const eventEmitter = require('../utils/eventEmitter') 
// require('dotenv').config()
// // constc heckorder=require("../controller/productionheadController")
// // Another file

// const {initializeApp,applicationDefault} = require('firebase-admin/app');
// const {getMessage} = require('firebase-admin/messaging');
// const { application } = require("express");

// process.env.GOOGLE_APPLICATION_CREDENTIALS

// initializeApp({
// Credential:applicationDefault(),
// projectId:'inner-redius-401719'
// });

// async function sendPushNotification(deviceToken, message) {
//   const payload = {
//     notification: {
//       title: 'Order Rejected',
//       body: message,
//     },
//   };

//   await admin.messaging().sendToDevice(deviceToken, payload);
// }

// eventEmitter.on('OrderRejected', async ({ salesPerson }) => {
//   try {
//     const { sales_name, sales_id, deviceToken } = salesPerson;

//     console.log(`Notification: Order for salesperson -->> ${sales_id} and  --> ${sales_name} is canceled. Notify Sales Manager.`);

//     // Additional logic related to notifying the sales manager can be added here

//     // Send push notification
//     const message = `Order for salesperson ${sales_id} and ${sales_name} is canceled. Notify Sales Manager.`;
//     await sendPushNotification(deviceToken, message);
//   } catch (error) {
//     console.error('Error handling OrderRejected event:', error);
//   }
// });




// eventEmitter.on('OrderRejected', async ({ salesPerson }) => {
//   try {
//     const{sales_name,sales_id}=salesPerson
//     // await notifysalesManager(checkorder.salesPerson);
//     console.log(`Notification: Order for salesperson -->> ${sales_id} and  --> ${sales_name} is canceled. Notify Sales Manager.`);
//     // Additional logic related to notifying the sales manager can be added here
//   } catch (error) {
//     console.error('Error handling OrderRejected event:', error);
//   }
// });







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



// const redis = require('redis');
// const redisClient = redis.createClient({
//     host: '127.0.0.1',
//     port: 6379,
// });

// redisClient.on('error', (error) => {
//     console.error("Error in Redis configuration:", error);
// });


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
            orderId:  result,
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

              // Update salesOrder //

        
              exports.edit = async (req, res) => {
                  try {
                      const findsalesOrder = await salesorder.findById(req.params.id);
                      if (findsalesOrder) {
                          const updatesalesOrder = await salesorder.findByIdAndUpdate(req.params.id, req.body, { new: true });
                          // Use { new: true } to get the updated document as a result
              
                          console.log(updatesalesOrder);
                          res.status(200).json({
                            updatedData:updatesalesOrder
                          });
                      } else {
                          res.status(404).json("Sales order not found");
                      }
                  } catch (error) {
                      console.error(error);
                      res.status(500).json("Data is not updated");
                  }
              };
              
    
    // // put one
    // exports.edit = async (req, res) => {
    //     try {
    //         // Update record from collection
    //         var updatedUser;
    //         var status = "0";
    
    //         switch (req.body.updateType) {
    //             case 'batchUpdate':
    //                 updatedUser = await salesorder.findOneAndUpdate({
    //                     _id: new mongoose.Types.ObjectId(req.params.id),
    //                     "products.productId": req.body.pid
    //                 }, {
    //                     $set: {
    //                         "products.$.batch_list": req.body.products.batch_list,
    //                         "orderstatus": "2"
    //                     }
    //                 }, { multi: true });
    //                 status = "2";
    //                 break;
    
    //             case 'productionInUpdate':
    //                 updatedUser = await salesorder.findOneAndUpdate({
    //                     _id: new mongoose.Types.ObjectId(req.params.id),
    //                     "products.productId": req.body.pid
    //                 }, {
    //                     $set: {
    //                         "products.$.pIn_id": req.body.products.pIn_id,
    //                         "products.$.productionincharge": req.body.products.productionincharge,
    //                         "products.$.assignDate": req.body.products.assignDate,
    //                         "products.$.completionDate": req.body.products.completionDate,
    //                         "products.$.phNote": req.body.products.phNote,
    //                         "orderstatus": "1"
    //                     }
    //                 }, { multi: true });
    //                 status = "1";
    //                 break;
    
    //             case 'SalesManager':
    //                 updatedUser = await salesorder.findOneAndUpdate(
    //                     { _id: new mongoose.Types.ObjectId(req.params.id) },
    //                     {
    //                         $set: {
    //                             clientName: req.body.clientName,
    //                             firmName: req.body.firmName,
    //                             address: req.body.address,
    //                             city: req.body.city,
    //                             phone_no: req.body.phone_no,
    //                             sales_id: req.body.sales_id,
    //                             sales_name: req.body.sales_name,
    //                             orderId: req.body.orderId,
    //                             currentDate: new Date().toISOString(),
    //                             deliveryDate: req.body.deliveryDate,
    //                             note: req.body.note,
    //                             products: req.body.products,
    //                             ph_id: req.body.ph_id,
    //                             ph_name: req.body.ph_name,
    //                             process_bar: req.body.process_bar,
    //                             smName: req.body.smName,
    //                             vehicleNum: req.body.vehicleNum,
    //                             dpDate: req.body.dpDate,
    //                             dpRecieved: req.body.dpRecieved,
    //                             dpPhone: req.body.dpPhone,
    //                             dpTotalWeight: req.body.dpTotalWeight,
    //                             "orderstatus": "0"
    //                         }
    //                     }, { multi: true }
    //                 );
    //                 status = "0";
    //                 break;
    
    //             default:
    //                 updatedUser = await salesorder.findOneAndUpdate(req.params.id, req.body, { new: true });
    //                 status = "3";
    //                 console.log(updatedUser)
    //         }
    
    //         var updStatus = await salesorder.findById(req.params.id).exec();
    //         updStatus.set({ 'orderstatus': status });
    //         await updStatus.save();
    
    //         updatedUser = await salesorder.findById(req.params.id);
    //         res.status(201).json({ "status": 200, "msg": 'record successfully updated', res: updatedUser });
    
    //     } catch (err) {
    //         res.status(400).json({ message: err.message });
    //     }
    // };


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


    
exports.allRecords = async(req, res) => {
    // Rest of the code will go here
    try {
        const resPerPage = 10; // results per page
        const page = req.params.page || 1; // Page 
        // const orderList = await salesorder.find().skip((resPerPage * page) - resPerPage).limit(resPerPage);  
        const orderList = await salesorder.find().sort({ '_id': -1 });
        res.json({ "status": 200, "msg": 'data has been fetched', res: orderList });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}



// const redis = require('redis');
// const redisClient = redis.createClient({
//     host: '127.0.0.1',
//     port: 6379,
// });

// redisClient.on('error', (error) => {
//     console.error("Error in Redis configuration:", error);
// });

// exports.allRecords = async (req, res) => {
//     const key = "allUsers";

//     try {
//         if (!redisClient.connect) {
//             console.error("Redis client is not connected");
//             return res.status(500).json({ error: 'Internal Server Error' });
//         }

//         const getCachedData = () => {
//             return new Promise((resolve, reject) => {
//                 redisClient.get(key, (err, cachedData) => {
//                     if (err) {
//                         console.error(`Redis Error: ${err}`);
//                         reject({ error: 'Internal Server Error' });
//                     } else {
//                         resolve(cachedData);
//                     }
//                 });
//             });
//         };

//         const cachedData = await getCachedData();

//         if (cachedData) {
//             console.log('All Users data from cache', JSON.parse(cachedData));
//             return res.json({ data: JSON.parse(cachedData) });
//         }

//         const allUsers = await salesorder.find();

//         if (allUsers.length > 0) {
//             // Store data in Redis with an expiration time (e.g., 1 hour)
//             redisClient.setEx(key, 3600, JSON.stringify(allUsers));
//             console.log('All Users from database', allUsers);
//             return res.json({ data: allUsers });
//         } else {
//             console.log('No users found in the database');
//             return res.status(404).json({ error: 'No Users found' });
//         }
//     } catch (error) {
//         console.error('Unhandled Promise Rejection:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// };


           //  All records data //
// exports.allRecords = async (req, res) => {
//     const key = "allUsers";

//     try {
//         if (!redisClient.connected) {
//             console.error("Redis client is not connected");
//             return res.status(500).json({ error: 'Internal Server Error' });
//         }

//         const cachedData = await new Promise((resolve, reject) => {
//             redisClient.get(key, (err, cachedData) => {
//                 if (err) {
//                     console.error(`Redis Error: ${err}`);
//                     reject({ error: 'Internal Server Error' });
//                 } else {
//                     resolve(cachedData);
//                 }
//             });
//         });

//         if (cachedData) {
//             console.log('All Users data from cache', JSON.parse(cachedData));
//             // No need to close the Redis client here
//             return res.json({ data: JSON.parse(cachedData) });
//         }

//         const allUsers = await salesorder.find();
//         console.log(allUsers)

//         if (allUsers.length > 0) {
//             // Store data in Redis with an expiration time (e.g., 1 hour)
//             redisClient.setex(key, 3600, JSON.stringify(allUsers));
//             console.log('All Users from database', allUsers);
//             // No need to close the Redis client here
//             return res.json({ data: allUsers });
//         } else {
//             console.log('No users found in the database');
//             // No need to close the Redis client here
//             return res.status(404).json({ error: 'No Users found' });
//         }
//     } catch (error) {
//         console.error('Unhandled Promise Rejection:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     } 
// };



// exports.allRecords = async (req, res) => {
 
//     const key = "allUsers";

//     try {
//         if (redisClient.connected) {
//             const cachedData = await new Promise((resolve, reject) => {
//                 redisClient.get(key, (err, cachedData) => {
//                     if (err) {
//                         console.error(`Redis Error: ${err}`);
//                         reject({ error: 'Internal Server Error' });
//                     } else {
//                         resolve(cachedData);
//                     }
//                 });
//             });

//             if (cachedData) {
//                 console.log('All Users data from cache', JSON.parse(cachedData));
//                 return res.json({ data: JSON.parse(cachedData) });
//             }

//             const allUsers = await salesorder.find();

//             if (allUsers.length > 0) {
//                 // Store data in Redis with an expiration time (e.g., 1 hour)
//                 redisClient.setex(key, 3600, JSON.stringify(allUsers));
//                 console.log('All Users from database', allUsers);
//                 return res.json({ data: allUsers });
//             } else {
//                 console.log('No users found in the database');
//                 return res.status(404).json({ error: 'No Users found' });
//             }
//         } else {
//             console.error("Redis client is not connected");
//             return res.status(500).json({ error: 'Internal Server Error' });
//         }
//     } catch (error) {
//         console.error('Unhandled Promise Rejection:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }


// };

