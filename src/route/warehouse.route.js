const express = require('express');

const router=express.Router();

const verifyToken=require('../middleware/token/verifyToken');

const verifyRole=require('../middleware/role/verifyRole');

const upload=require('../middleware/ImageUpload/imageUploadMiddleware')

const warehouseController=require('../controller/warehouse.controller');

// const threePLController=require('../controller/warehouse.controller')

// All Warehouse and 3PL
router.get('/get/WareHouse/all',warehouseController.allWareHouse);

// Warehouse
router.post('/add/warehouse',verifyToken.verify,verifyRole('WAREHOUSE'),upload.fields([{name:"wareHouseImage", maxCount:5}]),warehouseController.AddWareHouse);
router.get('/get/WareHouse/Lister',verifyToken.verify,warehouseController.getListerWarehouse);
router.get('/get/WareHouse/Detail',warehouseController.singleWareHouse);

// 3PL Warehouse
router.post('/add/ThreePL/Warehouse',verifyToken.verify,verifyRole('WAREHOUSE'),upload.fields([{ name: 'warehouse_details[WarehouseImage]', maxCount: 5 }]),warehouseController.Add3PLWarehouse);
router.get('/get/3PL/WareHouse/Lister/All',verifyToken.verify,warehouseController.AllPLWarehouse);
router.get('/get/3PL/WareHouse/Lister/Single',verifyToken.verify,warehouseController.singlePLWarehouse);

// 3PL ColdStorage
router.post('/add/ThreePL/Coldstorage',verifyToken.verify,verifyRole('WAREHOUSE'),warehouseController.Add3PLColdStorage);
router.get('/get/3PL/ColdStorage/Lister/All',verifyToken.verify,warehouseController.AllPLColdStorage);
router.get('/get/3PL/ColdStorage/Lister/Single',verifyToken.verify,warehouseController.singlePLColdStorage);


router.get('/get/WareHouse/All/Search',warehouseController.searchWareHouseAll);
router.post('/add/ThreePL',verifyToken.verify,verifyRole('WAREHOUSE'),upload.fields([{ name: 'warehouse_details[WarehouseImage]', maxCount: 5 }]),warehouseController.Add3PL);

module.exports=router