const responseHandler = (res, statusCode, msg, data) => {
  return res.status(statusCode).json({
    status: true,
    message: msg,
    data: data,
  });
};


module.exports=responseHandler