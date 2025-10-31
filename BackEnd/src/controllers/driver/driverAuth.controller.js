const { validationResult } = require("express-validator");
const connectDB = require("../../config/dbConfig");
const msgConfig = require("../../config/msgConfig");
const Status = require("../../config/statusCode");
const errorHandler = require("../../handlers/errorHandler");
const responseHandler = require("../../handlers/responseHandler");
const { generateOTP } = require("../../helper/OTPfunction");
const sendOTP = require("../../helper/sendOTP");
const Driver = require("../../models/driver.model");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../helper/sendEmail");

const driverMobileLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorHandler(
        res,
        Status.CODES.BAD_REQUEST,
        "Validation Failed",
        errors.array()
      );
    }
    const { mobile_number } = req.body;

    //later we will add rate-limiting to this...

    //OTP Genration
    const OTP = generateOTP();
    const otpExpiresAt = new Date(
      Date.now() + process.env.OTP_EXPIRY_IN_MINUTES * 60 * 1000
    );

    //Creation || Update

    const [driver, created] = await Driver.findOrCreate({
      where: {
        mobile_number: mobile_number,
      },
      defaults: {
        mobile_number,
        mobile_otp: OTP,
        otp_expires: otpExpiresAt,
        otp_requested_at: new Date(),
        role_Id: 2,
      },
    });

    if (!created) {
      await driver.update({
        mobile_otp: OTP,
        otp_expires: otpExpiresAt,
        otp_requested_at: new Date(),
      });
    }
    const maskedNumber = mobile_number.replace(
      /(\+91)(\d{2})\d{6}(\d{2})/,
      "$1$2******$3"
    );

    //Sending the OTP
    await sendOTP(
      mobile_number,
      created ? `User` : `${driver.first_name} ${driver.last_name}`,
      OTP,
      (role_Id = 2)
    );

    return responseHandler(
      res,
      created ? Status.CODES.CREATED : Status.CODES.SUCCESS,
      "OTP sent successfully",
      {
        mobile_number: maskedNumber,
        otp_expires_in: process.env.OTP_EXPIRY_IN_MINUTES * 60,
        retry_after_seconds: 60,
      }
    );
  } catch (error) {
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in driverMobileLogin Controller",
      error
    );
  }
};

const verifyCaptainMobileOTP = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   errorHandler(
    //     res,
    //     Status.CODES.BAD_REQUEST,
    //     "Validation Failed",
    //     errors.array()
    //   );
    // }
    const { mobile_number, otp } = req.body;

    const captain = await Driver.findOne({
      attributes: ["mobile_otp", "otp_expires", "id", "role_Id"],
      where: {
        mobile_number: mobile_number,
      },
    });

    if (Date.now() > captain.otp_expires) {
      return errorHandler(
        res,
        Status.CODES.UNAUTHORIZED,
        "OTP Expired, Please request new one"
      );
    }

    //valid the OTP
    if (otp !== captain.mobile_otp) {
      return errorHandler(
        res,
        Status.CODES.UNAUTHORIZED,
        "OTP is not valid, please try again"
      );
    }

    //update the mobile_opt_verifiaction
    await captain.update({
      is_mobile_otp_verified: true,
    });
    const maskedNumber = mobile_number.replace(
      /(\+91)(\d{2})\d{6}(\d{2})/,
      "$1$2******$3"
    );
    //need to create Token...
    const token = jwt.sign(
      { id: captain.id, role_Id: captain.role_Id },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Cookie expiry of 7 days
      httpOnly: true,
      sameSite: "strict", // Prevent CSRF attacks
    });
    return responseHandler(
      res,
      Status.CODES.SUCCESS,
      "OTP Verified successfully",
      {
        mobile_number: maskedNumber,
        token: token,
      }
    );
  } catch (error) {
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in verifyCaptainMobileOTP Controller",
      error
    );
  }
};

const emailOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorHandler(
        res,
        Status.CODES.BAD_REQUEST,
        "Validation Failed",
        errors.array()
      );
    }
    const { email } = req.body;
    const emailCheck = await Driver.findOne({
      where: {
        email,
      },
    });
    if (emailCheck && emailCheck.is_email_otp_verified == true) {
      return errorHandler(
        res,
        Status.CODES.CONFLICT,
        "Nah! Email Already Found!"
      );
    }

    const driver = await Driver.findOne({
      where: {
        id: req.driver.id,
      },
    });
    if (!driver) {
      return errorHandler(res, Status.CODES.NOT_FOUND, "No Driver Found!");
    }

    const OTP = generateOTP();
    const otpExpiresAt = new Date(
      Date.now() + process.env.OTP_EXPIRY_IN_MINUTES * 60 * 1000
    );

    const emailParams = {
      email: email,
      otp: OTP,
      customerName: driver.first_name + driver.last_name,
    };
    driver.email = email;
    driver.email_otp = OTP;
    driver.email_otp_expires = otpExpiresAt;
    driver.is_email_otp_verified = false;

    await sendEmail(emailParams);

    driver.save();
    return responseHandler(
      res,
      Status.CODES.SUCCESS,
      "Email OTP sent successfully",
      driver
    );
  } catch (error) {
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in emailOTP Controller",
      error
    );
  }
};

const verifyEmailOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorHandler(
        res,
        Status.CODES.BAD_REQUEST,
        "Validation Failed",
        errors.array()
      );
    }
    const { email, email_otp } = req.body;
    const driver = await Driver.findOne({
      where: {
        id: req.driver.id,
        email: email,
      },
    });
    

    if (Date.now() > driver.email_otp_expires) {
      return errorHandler(
        res,
        Status.CODES.UNAUTHORIZED,
        "OTP Expired, Please request new one"
      );
    }

    if (email_otp != driver.email_otp) {
      return errorHandler(
        res,
        Status.CODES.UNAUTHORIZED,
        "OTP is not valid, please try again"
      );
    }

    driver.is_email_otp_verified = true;
    driver.save();

    if (driver.is_email_otp_verified && driver.profile_stage == 1) {
      driver.profile_stage = 2;
      driver.save();
    }
    return responseHandler(
      res,
      Status.CODES.SUCCESS,
      "Email OTP Verified successfully",
      driver
    );
  } catch (error) {
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in verifyEmailOTP Controller",
      error
    );
  }
};

module.exports = {
  driverMobileLogin,
  verifyCaptainMobileOTP,
  emailOTP,
  verifyEmailOTP,
};
