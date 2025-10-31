const { body } = require("express-validator");

const validateDriverMobileLogin = [
  body("mobile_number")
    // .isString().withMessage("")
    .isString()
    .withMessage("Phone Should be in the String DataType")
    .isLength({ min: 4, max: 17 }) //Some rare countries have 4 and 17 digit phone numbers
    .withMessage("Phone Number Should be in the Range of 4-17")
    .matches(/^[\d ()+]+$/) //Only allow numbers, spaces, and + signs
    .withMessage("Invalid Phone format"),
];


module.exports={
    validateDriverMobileLogin
}