function authorizeRoles(role) {
    let checkRole=role

    return (req, res, next) => {  
        req.role=checkRole;
      next();
    };
  }
  module.exports = authorizeRoles;