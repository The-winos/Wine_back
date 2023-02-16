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

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.admin) {
    next({
      name: "Permissions Invalid ",
      message: "You must have administrator access",
    });
  }
  next();
}

function requireUserOrAdmin(req, res, next) {
  if (!req.user) {
    next({
      name: "AuthenticationError",
      message: "You must be logged in to perform this action",
    });
  } else if (!req.user.admin && req.user.username !== req.params.username) {
    next({
      name: "Permissions Invalid",
      message: "You do not have permission to update this user",
    });
  } else {
    next();
  }
}

module.exports = {
  requireUser,
  requireAdmin,
  requireUserOrAdmin
};
