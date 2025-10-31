const express = require("express");
const { createRole } = require("../../controllers/roles.controller");
const router = express.Router();

router.post("/create-role", createRole);

module.exports = router;
