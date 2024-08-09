"use strict";

function authorizeRoles(role) {
  var checkRole = role;
  return function (req, res, next) {
    req.role = checkRole;
    next();
  };
}
module.exports = authorizeRoles;