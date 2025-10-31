const express=require('express')
const { addVehiclebrand, getAllVehiclebrands } = require('../../controllers/superAdmin/vehicle_brand.controller')
const router=express.Router()

router.post('/add',addVehiclebrand)
router.get('/get-all',getAllVehiclebrands)


module.exports=router