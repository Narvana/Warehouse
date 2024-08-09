"use strict";

var ApiErrors = function ApiErrors(statusCode, message) {
  return {
    status: 0,
    statusCode: statusCode,
    // data,
    message: message
  };
};
module.exports = ApiErrors;