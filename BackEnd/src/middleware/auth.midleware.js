const Status = require("../config/statusCode");
const errorHandler = require("../handlers/errorHandler");
const jwt = require("jsonwebtoken");
const Driver = require("../models/driver.model");
const SuperAdmin = require("../models/superAdmin/auth/superAdmin.model");

const driverAuth = async (req, res, next) => {
  try {    
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) {
      errorHandler(res, Status.CODES.NOT_FOUND, "No Token Provided");
    }
    //verifying the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const driver = await Driver.findByPk(decoded.id, {
      attributes: {
        exclude: ["password"],
      },
    });

    req.driver = driver;
    next();
  } catch (error) {
    console.error("Error during authentication:", error.message);

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      errorHandler(
        res,
        Status.CODES.BAD_REQUEST,
        "Unauthorized: Token has expired."
      );
    } else if (error.name === "JsonWebTokenError") {
      errorHandler(
        res,
        Status.CODES.BAD_REQUEST,
        "Unauthorized: Invalid token."
      );
    }

    // General error response
    errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Internal server error during authorization.",
      error
    );
  }
};

const superAdminAuth = async (req, res, next) => {
  try {    
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) {
      errorHandler(res, Status.CODES.NOT_FOUND, "No Token Provided");
    }
    //verifying the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const driver = await SuperAdmin.findByPk(decoded.id, {
      attributes: {
        exclude: ["password"],
      },
    });

    req.admin = driver;
    next();
  } catch (error) {
    console.error("Error during authentication:", error.message);

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      errorHandler(
        res,
        Status.CODES.BAD_REQUEST,
        "Unauthorized: Token has expired."
      );
    } else if (error.name === "JsonWebTokenError") {
      errorHandler(
        res,
        Status.CODES.BAD_REQUEST,
        "Unauthorized: Invalid token."
      );
    }

    // General error response
    errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Internal server error during authentication.",
      error
    );
  }
};

module.exports = {
  driverAuth,
  superAdminAuth
};
