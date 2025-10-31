const { body } = require("express-validator");

const validateDriverProfileSetUp = [
  //   body("email")
  //     // .isString().withMessage("")
  //     .isString()
  //     .withMessage("Email Should be in the String DataType")
  //     .isEmail()
  //     .withMessage("Email should be in the format"),

  body("first_name")
    .notEmpty()
    .withMessage("Please Enter the First Name")
    .isString()
    .withMessage("First Name Should be in the String DataType")
    .isLength({ min: 1, max: 15 })
    .withMessage("First Name, Atleast One charcter"),

  body("last_name")
    .notEmpty()
    .withMessage("Please Enter the Last Name")
    .isString()
    .withMessage("Last Name Should be in the String DataType")
    .isLength({ min: 1, max: 15 })
    .withMessage("Last Name, Atleast One charcter"),

  body("city")
    .isString()
    .withMessage("Last Name Should be in the String DataType"),

  body("languages_spoken").optional(),

  body("gender")
    .optional()
    .isIn(["male", "female", "other", "Male", "Female", "Others", "M", "F"])
    .withMessage("Gender should be male, female, or other"),
  body("dob")
    .notEmpty()
    .withMessage("Please Enter the DOB")
    .isISO8601("yyyy-mm-dd")
    .withMessage(
      "Date Of Birth should be in must be in correct format yyyy:mm:dd"
    ),
];

const validateDriverPanCard = [
  body("pan_card_number")
    .notEmpty()
    .withMessage(" Please send the Pan Card Number")
    .isLength({ min: 10, max: 10 })
    .withMessage("Pan Card Number should be in 10 Characters"),
];

const validateDriverDL = [
  body("driving_license_number")
    .notEmpty()
    .withMessage(" Please send the Driving License Number")
    .isLength({ min: 16, max: 16 })
    .withMessage("Driving License Number should be in 16 Characters"),
];

module.exports = {
  validateDriverProfileSetUp,
  validateDriverPanCard,
  validateDriverDL,
};
