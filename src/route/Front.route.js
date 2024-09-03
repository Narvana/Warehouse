const express = require('express');

const router=express.Router();

const verifyToken=require('../middleware/token/verifyToken');

const {verifyRoles}=require('../middleware/role/verifyRole');

const upload=require('../middleware/ImageUpload/imageUploadMiddleware')

const FrontController=require('../controller/Front.controller');

// Other
router.get('/get/All/Verified',FrontController.AllVerified);
router.get('/get/All/Featured',FrontController.AllFeatured);
router.get('/get/Search',FrontController.searchWareHouseAll);
router.get('/get/Recent/Warehouse',FrontController.recentWarehouse);
// router.post('/add/ThreePL',verifyToken.verify,verifyRoles(['WAREHOUSE', 'ADMIN']),upload.fields([{ name: 'warehouse_details[WarehouseImage]', maxCount: 5 }]),warehouseController.Add3PL);

module.exports=router