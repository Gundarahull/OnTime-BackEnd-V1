const errorHandler = (res, statusCode, msg, error = null) => {
  let errorDetail = "";

  if (error) {
    if (Array.isArray(error)) {
      errorDetail = error;
    } else if (error instanceof Error) {
      errorDetail = error.message;
    } else if (typeof error === "string") {
      errorDetail = error;
    }
  }

  return res.status(statusCode).json({
    status: false,
    message: msg,
    error: errorDetail || null,
  });
};

module.exports = errorHandler;
