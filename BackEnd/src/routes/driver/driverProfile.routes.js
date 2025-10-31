const express = require("express");
const {
  driverProfile,
  verifyPanCard,
  verifyDrivingLicense,
  uploadFrontDrivingLicense,
  uploadBackDrivingLicense,
  uploadPanCard,
} = require("../../controllers/driver/driverProfile.controller");
const { driverAuth } = require("../../middleware/auth.midleware");
const {
  validateDriverProfileSetUp,
  validateDriverPanCard,
  validateDriverDL,
} = require("../../validations/driver/driverProfile");
const uploadFiles = require("../../handlers/uploadFileHandler");
const router = express.Router();

//Storage
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/profile-set-up",
  driverAuth,
  validateDriverProfileSetUp,
  driverProfile
);

router.post("/pan-verify", driverAuth, validateDriverPanCard, verifyPanCard);

router.post(
  "/pan-image",
  driverAuth,
  upload.single("file"),
  uploadPanCard
);

router.post(
  "/dl-verify",
  driverAuth,
  //uploadFiles,
  validateDriverDL,
  verifyDrivingLicense
);

router.post(
  "/dl-front-image",
  driverAuth,
  upload.single("file"),
  uploadFrontDrivingLicense
);

router.post(
  "/dl-back-image",
  driverAuth,
  upload.single("file"),
  uploadBackDrivingLicense
);

module.exports = router;
