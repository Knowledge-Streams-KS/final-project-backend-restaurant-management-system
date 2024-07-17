const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = res.locals.user.role;
    if (allowedRoles.includes(userRole)) {
      console.log("----------------Allowed Roles-------", allowedRoles);
      next();
    } else {
      return res.status(403).json({
        message: "Forbidden: You do not have the necessary permissions",
      });
    }
  };
};

export default checkRole;
