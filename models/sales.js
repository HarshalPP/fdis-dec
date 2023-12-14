const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var currentDate = new Date();
var timestamp = currentDate.getTime();
const saleSchema = new Schema({
  // clientId:{
  //   type: String,
  //   required: true
  // },
  // --------client data---------  
  // editstatus:{
  //   type: Boolean,
  //   default: true

  // },
  clientName:
  {
    type: String//,
    //required: true
  },
  firmName:
  {
    type: String//,
    //required: true
  },
  address:
  {
    type: String//,
    //required: true
  },
  city:
  {
    type: String//,
    //required: true
  },
  phone_no:
  {
    type: Number,
    maxlength: 10
  },
  //--------- order create-----------
  sales_id:{
    type: String//,
    //required: true
  },
  sales_name:{
    type: String//,required: true
  },
  orderId:
  {
    type: String//,
   // required: true
  },
  deliveryDate:
  {
    type: String//,
    //required: true
  },
  currentDate:{
    type:String//,
   // required:true
  },
  note:
  {
    type: String
  },
  orderstatus:
  {
    type:Number
  },
  products: [
    {
    isOrderReady:
  {
    type: Boolean
  },
    productId:{
      type: String//,
//      required: true
    },
  select_product:
  {
    type: String//,
//    required: true
  },
    company: {
      type: String//,
//      required: true
    },
    grade:
    {
      type: String//,
//      required: true
    },
    topcolor:
    {
      type: String//,
//      required: true
    },
    coatingnum:
    {
      type: Number//,
//      required: true
    },
    temper:
    {
      type: String//,
 //     required: true
    },
    guardfilm:
    {
      type: String//,
//      required: true
    },
    thickness:
    {
      type: Number//,
//      required: true
    },
    width:
    {
      type: Number//,
//      required: true
    },
    length:
    {
      type: Number//,
//      required: true
    },
    pcs:
    {
      type: Number//,
 //     required: true
    },
    weight:
    {
      type: Number//,
//      required: true
    },
    rate:
    {
      type: Number//,
//      required: true
    },
    gst:
    {
      type: Number//,
//      required: true // if order with gst store 1 and without gst store 2
    },
//    production_in:[
//   {
      pIn_id:{
        type: String//,
        //  required: true
      },
      productionincharge:
      {
        type: String//,
      //    required: true
      },
      assignDate:
      {
        type: String//,
    //    required: true
      },
      completionDate:
      {
        type: String//,
    //    required: true
      },
      phNote:{
        type: String
      },
  //  }],
    batch_list: [{
      batch_id:{
        type: String//,
      //  required: true
      },
      batch_no:{
        type: String//,
      //  required: true
      }
    }]
  }],
  //-------- production head data-----------
  ph_id:{
    type: String
  },
  ph_name:{
    type: String
  },
  process_bar: {
    type: String//,
  //  required: true
  },
  
  //------- dispatch manager
  smName:
  {
    type :String//,
  //  required:true
  },
  dp_id:{

  },
  vehicleNum:
  {
    type: String//,
//    required:true
  },
  dpDate:
  {
    type : String//,
//    required:true
  },
  dpRecieved:
  {
    type: String//,
//    required: true
  },
  dpPhone:
  {
    type:Number//,
   // required:true
  },
  dpTotalWeight:
  {
    type: Number//,
    //required:true
  }
},
{ 
  timestamps: true 
}
);

const sales = mongoose.model("saleorders", saleSchema);
module.exports = sales;