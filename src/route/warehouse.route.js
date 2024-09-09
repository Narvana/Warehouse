const express = require('express');

const router=express.Router();

const verifyToken=require('../middleware/token/verifyToken');

const {verifyRoles}=require('../middleware/role/verifyRole');

const upload=require('../middleware/ImageUpload/imageUploadMiddleware')

const warehouseController=require('../controller/warehouse.controller');


// Warehouse
router.post('/add/warehouse',verifyToken.verify,verifyRoles(['LISTER', 'ADMIN']),upload.fields([{name:"wareHouseImage", maxCount:5}]),warehouseController.AddWareHouse);

router.get('/get/WareHouse/Lister',verifyToken.verify,warehouseController.getListerAllWarehouse);

router.get('/get/WareHouse/Detail',warehouseController.singleWareHouse);

router.put('/update/WareHouse',verifyToken.verify,warehouseController.UpdateWarehouse);

router.delete('/delete/WareHouse',verifyToken.verify,warehouseController.DeleteWarehouse);

// Other
router.post('/add/ThreePL',verifyToken.verify,verifyRoles(['WAREHOUSE', 'ADMIN']),upload.fields([{ name: 'warehouse_details[WarehouseImage]', maxCount: 5 }]),warehouseController.Add3PL);

module.exports=router