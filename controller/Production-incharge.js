const OrderDetails = require('../models/sales');
const eventEmitter = require('../utils/eventEmitter');
const admin = require('firebase-admin');
const serviceAccount = require('../config/fcm.json');
const salesorder = require('../models/sales'); // Assuming salesorder is the correct model

// Check if Firebase Admin SDK is already initialized
if (!admin.apps.length) {
  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function sendPushNotification(deviceToken, message) {
  const payload = {
    notification: {
      title: 'Order Accepted',
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

// Listen for 'OrderAccepted' event
// Listen for 'OrderAccepted' event
eventEmitter.on('OrderAccepted', async ({ orderId, sales_id }) => {
    try {
      const salesPerson = await salesorder.findOne({ sales_id });
  
      if (!salesPerson) {
        console.error('Sales person not found for sales_id:', sales_id);
        return;
      }
  
      const { sales_name } = salesPerson;
      const staticDeviceToken = 'your_static_device_token'; // Replace with your static device token
  
      console.log(`New Order has Accpected by Production-head`);
  
      // Additional logic related to notifying the production head manager can be added here
  
      // Send FCM notification to the static device token
      const message = `New Order has Accpected by Production-head ${sales_name}`;
      await sendPushNotification(staticDeviceToken, message);
    } catch (error) {
      console.error('Error handling OrderAccepted event:', error);
    }
  });
  




exports.showOrderDetails = async (req, res) => {
  try {
    const newOrderDetails = await OrderDetails.find({});

    // Filter orders with 'Accepted' status
    const acceptedOrders = newOrderDetails.filter(order => order.orderstatus === 'Accepted');

    res.status(200).json({
      orderDetails: acceptedOrders,
    });
  } catch (error) {
    console.error('Error in showOrderDetails:', error);
    res.status(500).json({
      error: error.message,
    });
  }
};
