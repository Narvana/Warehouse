const express = require('express');

const router=express.Router();

const verifyToken=require('../middleware/token/verifyToken');

const verifyRole=require('../middleware/role/verifyRole');

const upload=require('../middleware/ImageUpload/imageUploadMiddleware')

const PLWarehouseController=require('../controller/3PLWarehouse.controller');

// 3PL Warehouse
router.post('/add/ThreePL/Warehouse',verifyToken.verify,verifyRole('WAREHOUSE'),upload.fields([{ name: 'warehouse_details[WarehouseImage]', maxCount: 5 }]),PLWarehouseController.Add3PLWarehouse);
router.get('/get/3PL/WareHouse/Lister/All',verifyToken.verify,PLWarehouseController.AllPLWarehouse);
router.get('/get/3PL/WareHouse/Lister/Single',verifyToken.verify,PLWarehouseController.singlePLWarehouse);
router.put('/update/3PL/Warehouse',verifyToken.verify,PLWarehouseController.UpdatePLWarehouse);
router.delete('/delete/3PL/Warehouse',verifyToken.verify,PLWarehouseController.DeletePLWarehouse);

module.exports=router