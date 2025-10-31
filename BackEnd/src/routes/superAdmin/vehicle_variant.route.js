const express = require("express");
const {
  addVehicleVariant,
  getAllVehicleVaraintsUnderModel,
} = require("../../controllers/superAdmin/vehicle_variant.controller");

const router = express.Router();

router.post("/add", addVehicleVariant);
router.get("/get-all", getAllVehicleVaraintsUnderModel);

module.exports = router;
