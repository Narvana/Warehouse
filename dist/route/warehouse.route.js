"use strict";

var express = require('express');
var router = express.Router();
var verifyToken = require('../middleware/token/verifyToken');
var verifyRole = require('../middleware/role/verifyRole');
var upload = require('../middleware/ImageUpload/imageUploadMiddleware');
var warehouseController = require('../controller/warehouse.controller');
router.post('/add/warehouse', verifyToken.verify, verifyRole('WAREHOUSE'), upload.fields([{
  name: "wareHouseImage",
  maxCount: 5
}]), warehouseController.AddWareHouse);
router.get('/get/WareHouse/all', warehouseController.allWareHouse);
router.get('/get/WareHouse', verifyToken.verify, warehouseController.getWarehouse);

// single detail with query id
router.get('/get/WareHouse/Detail', warehouseController.singleWareHouse);
module.exports = router;