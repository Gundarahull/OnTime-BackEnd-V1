const express = require("express");
const router = express.Router();

const authRoutes = require("./driverAuth.routes");
const profileRoutes = require("./driverProfile.routes");
const vehicleRoutes = require("../driver/driverVehicle.routes");

router.use("/auth", authRoutes); // /api/v1/driver/auth/...
router.use("/profile", profileRoutes); // /api/v1/driver/profile/...
router.use("/vehicle", vehicleRoutes);

module.exports = router;
