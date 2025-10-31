const express = require("express");
const {
  getAllVehiclebrands,
} = require("../../controllers/superAdmin/vehicle_brand.controller");
const { driverAuth } = require("../../middleware/auth.midleware");
const {
  permissionCheckDriver,
} = require("../../middleware/permissons.middleware.js");
const router = express.Router();

router.use(driverAuth);
router.use(permissionCheckDriver);
router.get("/brands", getAllVehiclebrands);

router.post("/add-vehicle")

module.exports = router;
