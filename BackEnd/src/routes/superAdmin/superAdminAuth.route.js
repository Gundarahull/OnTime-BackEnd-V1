const express = require("express");
const {
  SuperAdminRegister,
  superAdminLogin,
} = require("../../controllers/superAdmin/superAdminAuth.controller");
const router = express.Router();

router.post("/register", SuperAdminRegister);
router.post("/login", superAdminLogin);

module.exports = router;
