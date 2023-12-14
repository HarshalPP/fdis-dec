const express = require("express");
const router = express.Router();
const productionheadController = require("../controller/productionheadController");
const token = require("../middleware/token");

// Get All Route
router.get("/", token,productionheadController.allRecords);
// Get One Route
router.get("/get/:id",  productionheadController.get);
// Create One Route
router.post('/create/', /*token,*/ productionheadController.create);
//Put One
router.put("/edit/:id", token, productionheadController.edit);
// Edit One Route PATCH version
router.patch("/:id", async (req, res) => {
  // Rest of the code will go here

});
//Delete One
router.delete("/delete/:id", token, productionheadController.delete);

// token

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}



module.exports = router;