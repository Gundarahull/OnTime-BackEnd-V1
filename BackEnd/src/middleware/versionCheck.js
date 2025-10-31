const APIVersionCheck = (version) => (req, res, next) => {
  if (
    req.originalUrl.startsWith(`/api/${version}`) ||
    req.originalUrl.startsWith(`/api/v2`)
  ) {
    next();
  } else {
    return res
      .status(404)
      .json({ success: false, message: `API version not found` });
  }
};

module.exports = APIVersionCheck;
