"use strict";

var defineRole = function defineRole(role) {
  var roleSet = role;
  return function (req, res, next) {
    req.role = roleSet; // Attach role to the request object
    next(); // Pass control to the next middleware
  };
};
module.exports = defineRole;