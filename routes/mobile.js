const express=require('express')
const router=express.Router()
const mobileController=require('../controller/Mobilelogin')


router.post('/MobileReg',mobileController.create)
router.post('/MobileLogin',mobileController.login)

module.exports=router;