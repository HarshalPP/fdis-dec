const productionSchema = require("../models/productionhead");
const purchase=require("../models/purchaseStockSchema")
const orderdetails=require('../models/sales')
const mongoose  = require('mongoose');
const { notify } = require("../routes/productionhead");
const sales = require("../models/sales");
const eventEmitter = require("../utils/eventEmitter");


//create

exports.checkorder = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const decision = req.query.decision;
    const UpdateId = req.params.id;

    // Find the order by orderId
    const orderDetails = await orderdetails.findById(UpdateId);

    // Check if the orderDetails is not null
    if (!orderDetails) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (decision === 'accept') {
      orderDetails.orderstatus = 'Accepted';

      // Save the updated order status
      const result = await orderDetails.save();
      
      console.log('After Update:', result);

      return res.status(200).json({ orderId: orderId, updatedData: result });
    } else if (decision === 'reject') {
      const salesPersonId = orderDetails.orderId;
      orderDetails.orderstatus = 'Rejected';

      // Save the updated order status
      const result = await orderDetails.save();
      
      console.log('After Update:', result);

      // Notify the sales manager about rejection
      await notifysalesManager(salesPersonId);

      return res.status(200).json({ orderId: orderId, updatedData: result });
    } else {
      return res.status(400).json({ error: 'Invalid decision' });
    }
  } catch (error) {
    console.error('Error in checkorder:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

async function notifysalesManager(orderId) {
  try {
    // Use findOne to find the order details by orderId
    const orderDetails = await orderdetails.findOne({ orderId: orderId });

    if (!orderDetails) {
      console.error('Order not found for orderId:', orderId);
      return;
    }

    // Use the sales_id from orderDetails to fetch the sales person
    const salesPersonId = orderDetails.sales_id;
    const salesPerson = await orderdetails.findOne({ sales_id: salesPersonId });

    console.log("salesPerson data is",salesPerson);

    if (salesPerson) {
      
      // Check if the fetched sales person has the same order_id as provided in the request
      if (salesPerson.orderId === orderId) {
        const dataEmit = eventEmitter.emit('OrderRejected',  { salesPerson });
        console.log("data Emit is", dataEmit);
        
      } else {
        console.error('Sales person found, but order_id does not match:', orderId);
      }
    } else {
      console.error('Sales person not found for salesPersonId:', salesPersonId);
    }
  } catch (error) {
    console.error('Error notifying Sales Manager:', error);
  }
}



      
      
  
exports.create = async (req, res) => {
    // Rest of the code will go here
    const user = new productionSchema({  
        productionincharge: req.body.productionincharge,
        deliveryDate: req.body.deliveryDate,
        completionDate: req.body.completionDate,
        _cId: mongoose.Types.ObjectId(req.body._cId),
        oId: mongoose.Types.ObjectId(req.body.oId), // order id from sales create order
    });
    try {
        const newUser = await user.save();
        res.status(201).json({ "status":200,"message":'data sucessfully inserted',newUser });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.orderdetails = async(req,res)=>{
    try{
        
    const finddata=await purchase.find()
    if(finddata){
        res.status(200).json({
            data:finddata
        })
    }
    }
    catch(error){

          res.status(500).json({
            error:error
          })
    }

}



// get
// exports.get = async (req, res) => {
//     try {
//         const userList = await productionSchema.aggregate([
//             { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
//             {
//                 $lookup: {
//                     from: 'clients',
//                     localField: '_cId',
//                     foreignField: '_id',
//                     as: 'clientdetails'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'saleorders',
//                     localField: 'oId',
//                     foreignField: 'orderId',
//                     as: 'orderdetails'
//                 }
//             }
//         ]);

//         console.log("userList  data is", userList)

//         res.json({ status: 200, message: 'Data has been fetched', data: userList });
//     } catch (error) {
//         res.status(500).json({ status: 500, message: 'An error occurred', error: error.message });
//     }
// }

exports.get = async (req, res) => {
    try {
        const user = await productionSchema.findOne({ _id: req.params.id })
            .populate('_cId')
            .populate('oId'); 

        if (!user) {
            res.status(404).json({ status: 404, message: 'Data not found' });
            return;
        }

        console.log("User data is", user);

        res.json({ status: 200, message: 'Data has been fetched', data: user });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'An error occurred', error: error.message });
    }
}





// put one
exports.edit = async (req, res) => {
    try {
        const updatedUser = await productionSchema.findById(req.params.id).exec();
        updatedUser.set(req.body);
        const updateProductionIn = await updatedUser.save();
        res.status(201).json({ "status": 200, "msg": 'record sucessfully updated',updatedUser });
       // res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

}
// delete
exports.delete = async (req, res) => {
    try {
        await productionSchema.findById(req.params.id).deleteOne(); 
        res.json({ message: "User has been deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
//pagination 
// exports.allRecords = async (req, res) => {
//     // Rest of the code will go here
//     try {
//         const resPerPage = 10; // results per page
//         const page = req.params.page || 1; // Page 
//         const userList = await productionSchema.find().skip((resPerPage * page) - resPerPage).limit(resPerPage); 

//         res.json({ userList })
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// }

exports.allRecords = async (req, res) => {
    try {
        const orderdetails = await productionSchema.aggregate([
            {
                $lookup: {
                    from: 'clients',
                    localField: 'clients',
                    foreignField: '_cId',
                    as: 'ClientsDetails'
                }
            },
            {
                $lookup: {
                    from: 'saleorders',
                    localField: 'saleorders',
                    foreignField: 'oId',
                    as: 'OrderDetails'
                }
            }
        ]);

        res.status(200).json({
            data: orderdetails
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};