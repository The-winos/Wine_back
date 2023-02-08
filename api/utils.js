function requireUser(req, res, next) {
  if (!req.users) {
    next({
      error: "401",
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.users.admin) {
    next({
      name: "Permissions Invalid ",
      message: "You must have administrator access",
    });
  }
  next();
}

module.exports = {
  requireUser,
  requireAdmin,
};
