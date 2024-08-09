"use strict";

var ApiResponse = function ApiResponse(statusCode, data, message) {
  // const user=new UserCreate()
  return {
    status: 1,
    statusCode: statusCode,
    message: message,
    data: data
  };
  // return user
};
module.exports = ApiResponse;