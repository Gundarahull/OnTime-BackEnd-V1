const express = require("express");
const {
  driverMobileLogin,
  verifyCaptainMobileOTP,
  emailOTP,
  verifyEmailOTP,
} = require("../../controllers/driver/driverAuth.controller");
const {
  validateDriverMobileLogin,
} = require("../../validations/driver/driverAuth");
const { driverAuth } = require("../../middleware/auth.midleware");
const {
  permissionCheckDriver,
} = require("../../middleware/permissons.middleware.js");
const {
  getAllVehiclebrands,
} = require("../../controllers/superAdmin/vehicle_brand.controller.js");
const router = express.Router();

router.post("/mobile-login", validateDriverMobileLogin, driverMobileLogin);
router.post("/mobile-verify-otp", verifyCaptainMobileOTP);

router.post("/email-otp", driverAuth, emailOTP);
router.post("/verify-email-otp", driverAuth, verifyEmailOTP);


module.exports = router;
