const Status = require("../config/statusCode");
const upload = require("../utils/multer");
const errorHandler = require("./errorHandler");
const multer = require("multer");

const uploadFiles = (req, res, next) => {
  const uploadHandler = upload.any(); // dynamic fields
  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      if (err.code === "LIMIT_FILE_COUNT") {
        return errorHandler(
          res,
          Status.CODES.BAD_REQUEST,
          "Too many files uploaded. Please upload exactly 2 files."
        );
      }
      if (err.code === "LIMIT_FILE_SIZE") {
        return errorHandler(
          res,
          Status.CODES.BAD_REQUEST,
          "File size too large. Max 2MB allowed."
        );
      }
      return errorHandler(res, Status.CODES.BAD_REQUEST, err.message);
    } else if (err) {
      // Other unknown errors
      return errorHandler(res, Status.CODES.INTERNAL_SERVER_ERROR, err.message);
    }
    // If no errors, continue
    next();
  });
  // Check for exactly 2 files
  if (!req.files || req.files.length > 2) {
    return errorHandler(
      res,
      Status.CODES.BAD_REQUEST,
      "Please upload exactly 2 files"
    );
  }
};

module.exports = uploadFiles;
