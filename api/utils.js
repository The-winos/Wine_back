

function requireUser(req, res, next) {
  if (!req.user) {
    next({
      error: "401",
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }
  next();
}

function requireMerchantOrAdmin(req, res, next) {
  if (!req.user) {
    next({
      name: "AuthenticationError",
      message: "You must be logged in to perform this action",
    });
  } else if (!req.user.admin && req.user.role !== "merchant") {
    next({
      name: "Permissions Invalid",
      message: "You do not have permission to perform this action",
    });
  } else {
    next();
  }
}


function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    next({
      name: "Permissions Invalid ",
      message: "You must have administrator access",
    });
  }
  next();
}





module.exports = {
  requireUser,
  requireMerchantOrAdmin,
  requireAdmin,

};
