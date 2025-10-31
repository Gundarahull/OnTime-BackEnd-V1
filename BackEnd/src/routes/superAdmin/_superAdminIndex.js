const express = require("express");
const router = express.Router();

const roleRoutes = require("./roles.route");
const vehicleBrandRoutes = require("./vehicle_brand.route");
const vehicleModelRoutes = require("./vehicle_model.route");
const vehicleVariantRoutes = require("./vehicle_variant.route");
const authRoutes = require("./superAdminAuth.route.js");
const {
  permissionCheckSuperAdmin,
} = require("../../middleware/permissons.middleware.js");
const {
  driverAuth,
  superAdminAuth,
} = require("../../middleware/auth.midleware.js");

router.use("/auth", authRoutes);
router.use(superAdminAuth);
router.use(permissionCheckSuperAdmin);
router.use("/role", roleRoutes);
router.use("/vehicle-brand", vehicleBrandRoutes);
router.use("/vehicle-model", vehicleModelRoutes);
router.use("/vehicle-variant", vehicleVariantRoutes);

module.exports = router;
