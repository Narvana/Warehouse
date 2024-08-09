"use strict";

var multer = require('multer');
var ApiErrors = require('../../utils/ApiResponse/ApiErrors');
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, "./upload/images");
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + '-' + this.filename);
  }
});
var fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF files are allowed"), false);
  }
};
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1
  },
  fileFilter: fileFilter
});
module.exports = upload;