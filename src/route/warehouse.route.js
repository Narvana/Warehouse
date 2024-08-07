const express = require('express');

const router=express.Router();

const verifyToken=require('../middleware/token/verifyToken');

const verifyRole=require('../middleware/role/verifyRole');

const upload=require('../middleware/ImageUpload/imageUploadMiddleware')

const warehouseController=require('../controller/warehouse.controller');

router.post('/add/warehouse/:warehouseID',verifyToken.verify,verifyRole('WAREHOUSE'),upload.fields([{name:"wareHouseImage", maxCount:5}]),warehouseController.AddWareHouse);
router.get('/get/WareHouse/all',warehouseController.allWareHouse);
router.get('/get/WareHouse',verifyToken.verify,warehouseController.getWarehouse);

module.exports=router