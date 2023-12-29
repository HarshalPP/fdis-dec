const express=require('express')
const router=express.Router()
const Production_Incahrge=require('../controller/Production-incharge')


router.get('/Production_Incharge',Production_Incahrge.showOrderDetails)

module.exports=router