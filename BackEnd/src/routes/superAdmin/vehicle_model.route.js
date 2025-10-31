const express = require("express");
const {
  addVehicleModel,
  getAllVehicleModelsUnderBrand,
} = require("../../controllers/superAdmin/vehicle_model.controller");
const router = express.Router();

router.post("/add", addVehicleModel);
router.get("/get-all", getAllVehicleModelsUnderBrand);

module.exports = router;
