const crypto = require("crypto");

const generateOTP = (length = 6) => {
  const otp = crypto.randomInt(0, Math.pow(10, length)).toString();
  const OTP = otp.padStart(length, 0);
  return OTP;
};

module.exports = {
  generateOTP,
};
