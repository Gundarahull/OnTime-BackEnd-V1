const Status = require("../config/statusCode");
const errorHandler = require("../handlers/errorHandler");

const permissionCheckSuperAdmin = async (req, res, next) => {
  try {
    if (req.admin.role_Id !== 1) {
      return errorHandler(
        res,
        Status.CODES.FORBIDDEN,
        "Access denied. Only Super Admins can perform this action."
      );
    }
    next();
  } catch (error) {
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in permissionCheckSuperAdmin MiddleWare",
      error
    );
  }
};

const permissionCheckDriver = async (req, res, next) => {
  try {
    if (req.driver.role_Id !== 2) {
      return errorHandler(res, Status.CODES.FORBIDDEN, "Access denied.");
    }
    next();
  } catch (error) {  
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in permissionCheckDriver MiddleWare",
      error
    );
  }
};

const permissionCheckUser = async (req, res, next) => {
  try {
    if (req.user.role_Id !== 3 || req.user.role_Id !== 1) {
      return errorHandler(
        res,
        Status.CODES.FORBIDDEN,
        "Ur not Allowed to perform this Action"
      );
    }
    next();
  } catch (error) {
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Access denied. Only Users can perform this action.",
      error
    );
  }
};

module.exports = {
  permissionCheckDriver,
  permissionCheckSuperAdmin,
  permissionCheckUser,
};
