const express = require('express');

const router=express.Router();

const verifyToken=require('../middleware/token/verifyToken');

const verifyRole=require('../middleware/role/verifyRole');

const upload=require('../middleware/ImageUpload/imageUploadMiddleware')

const warehouseController=require('../controller/warehouse.controller');

// const threePLController=require('../controller/warehouse.controller')

router.post('/add/warehouse',verifyToken.verify,verifyRole('WAREHOUSE'),upload.fields([{name:"wareHouseImage", maxCount:5}]),warehouseController.AddWareHouse);

router.get('/get/WareHouse/Lister/all',warehouseController.allWareHouse);
router.get('/get/WareHouse',verifyToken.verify,warehouseController.getListerWarehouse);

// single detail with query id
router.get('/get/WareHouse/Detail',warehouseController.singleWareHouse);
router.get('/get/WareHouse/All/Search',warehouseController.searchWareHouseAll);

router.post('/add/ThreePL',verifyToken.verify,verifyRole('WAREHOUSE'),upload.fields([{ name: 'warehouse_details[WarehouseImage]', maxCount: 5 }]),warehouseController.Add3PL);


module.exports=router