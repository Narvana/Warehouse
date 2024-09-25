const express = require('express');

const router=express.Router();

const {verify}=require('../middleware/token/verifyToken');

const upload=require('../middleware/ImageUpload/imageUploadMiddleware')

const PLWarehouseController=require('../controller/3PLWarehouse.controller');

// 3PL Warehouse

// Add 3PL Warehouse
router.post('/add/ThreePL/Warehouse',verify(['LISTER', 'ADMIN']),upload.fields([{ name: 'warehouse_details[WarehouseImage]', maxCount: 5 }]),PLWarehouseController.Add3PLWarehouse);

// GET LISTER ALL 3PL Warehouse
router.get('/get/3PL/WareHouse/Lister/All',verify(['LISTER', 'ADMIN']),PLWarehouseController.AllPLWarehouse);

// GET Single 3PL Warehouse With provided ID
router.get('/get/3PL/WareHouse/Lister/Single',PLWarehouseController.singlePLWarehouse);

// UPDATE 3PL Warehouse Provide ID
router.put('/update/3PL/Warehouse',verify(['LISTER', 'ADMIN']),PLWarehouseController.UpdatePLWarehouse);

// DELETE 3PL Warehouse Provide ID
router.delete('/delete/3PL/Warehouse',verify(['LISTER', 'ADMIN']),PLWarehouseController.DeletePLWarehouse);

module.exports=router