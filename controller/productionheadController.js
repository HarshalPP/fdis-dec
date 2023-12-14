const productionSchema = require("../models/productionhead");
const mongoose  = require('mongoose');
//create
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
exports.allRecords = async (req, res) => {
    // Rest of the code will go here
    try {
        const resPerPage = 10; // results per page
        const page = req.params.page || 1; // Page 
        const userList = await productionSchema.find().skip((resPerPage * page) - resPerPage).limit(resPerPage); 

        res.json({ userList })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
