const express = require('express');

const router=express.Router();

const verifyToken=require('../middleware/token/verifyToken');

const verifyRole=require('../middleware/role/verifyRole');

const upload=require('../middleware/ImageUpload/imageUploadMiddleware')

const warehouseController=require('../controller/warehouse.controller');

// All Warehouse and 3PL
router.get('/get/WareHouse/all',warehouseController.allWareHouse);

// Warehouse
router.post('/add/warehouse',verifyToken.verify,verifyRole('WAREHOUSE'),upload.fields([{name:"wareHouseImage", maxCount:5}]),warehouseController.AddWareHouse);
router.get('/get/WareHouse/Lister',verifyToken.verify,warehouseController.getListerWarehouse);
router.get('/get/WareHouse/Detail',warehouseController.singleWareHouse);
router.put('/update/WareHouse',verifyToken.verify,warehouseController.UpdateWarehouse);
router.delete('/delete/WareHouse',verifyToken.verify,warehouseController.DeleteWarehouse);

// Other
router.get('/get/WareHouse/All/Search',warehouseController.searchWareHouseAll);
router.post('/add/ThreePL',verifyToken.verify,verifyRole('WAREHOUSE'),upload.fields([{ name: 'warehouse_details[WarehouseImage]', maxCount: 5 }]),warehouseController.Add3PL);

module.exports=router