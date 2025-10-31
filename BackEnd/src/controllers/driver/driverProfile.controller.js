const { validationResult } = require("express-validator");
const Driver = require("../../models/driver.model");
const responseHandler = require("../../handlers/responseHandler");
const errorHandler = require("../../handlers/errorHandler");
const Status = require("../../config/statusCode");
const DriverKYC = require("../../models/driver_kyc.model");
const axios = require("axios");
const { PAN_CARD_VERIFICATION } = require("../../config/env");
const {
  verifyPanViaAPI,
  verifyDrivingLicenseViaAPI,
} = require("../../service/driver/driver.profile.service");
const stringSimilarity = require("string-similarity");
const uploadOnCloudinary = require("../../utils/cloudinary");

const driverProfile = async (req, res) => {
  try {
    // need to add valiadtion for the
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorHandler(
        res,
        Status.CODES.BAD_REQUEST,
        "Validation Failed",
        errors.array()
      );
    }
    //it should be the same as the DL and RC
    const { first_name, last_name, city, gender, languages_spoken, dob } =
      req.body;
    //email Check

    const driver = await Driver.findByPk(req.driver.id, {
      attributes: [
        "id",
        "first_name",
        "last_name",
        "city",
        "gender",
        "languages_spoken",
        "is_mobile_otp_verified",
        "profile_stage",
        "is_dl_profile_verified",
        "dob",
      ],
    });
    //if and not if the profile not verfied then only can update his name...
    if (driver.is_dl_profile_verified == false) {
      driver.first_name = first_name;
      driver.last_name = last_name;
      driver.dob = dob;
    }
    driver.city = city;
    driver.gender = gender;
    driver.languages_spoken = languages_spoken;
    if (driver.profile_stage == 0) {
      driver.profile_stage = 1;
    }

    await driver.save();

    return responseHandler(
      res,
      Status.CODES.SUCCESS,
      "Driver Profile Succesfully Saved",
      driver
    );
  } catch (error) {
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in driverProfile Controller",
      error
    );
  }
};

const driverVehicle = async (req, res) => {
  try {
    // DL TEXT, pan card,
    const { dl_text_number, pan_card_number } = req.body;
    const driverKYC = await DriverKYC.create({
      driver_id: req.driver.id, //ForeignKEY
      pan_number: pan_card_number,
      driving_license_number: dl_text_number,
    });
  } catch (error) {
    console.log("Error in the driverVehicle Controller-----------", error);
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in driverVehicle Controller",
      error
    );
  }
};

const verifyPanCard = async (req, res) => {
  try {
    // need to add valiadtion for the
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorHandler(
        res,
        Status.CODES.BAD_REQUEST,
        "Validation Failed",
        errors.array()
      );
    }
    const { pan_card_number } = req.body;

    //fETCH FROM THE dB TO AVOID api calls
    let panReponse;
    const panAPI = await DriverKYC.findOne({
      where: {
        pan_number: pan_card_number,
      },
    });
    if (panAPI) {
      panReponse = panAPI.pan_api_response.data;
    } else {
      panReponse = await verifyPanViaAPI(pan_card_number);
    }
    const driver = await Driver.findByPk(req.driver.id);
    const full_name_one = `${driver.first_name} ${driver.last_name}`
      .toLowerCase()
      .trim();
    const full_name_two = `${driver.last_name} ${driver.first_name}`
      .toLowerCase()
      .trim();
    const apiName = panReponse.data.data.full_name.toLowerCase().trim();

    const match_one = stringSimilarity.compareTwoStrings(
      apiName,
      full_name_one
    );
    const match_two = stringSimilarity.compareTwoStrings(
      apiName,
      full_name_two
    );
    const maxMatch = Math.max(match_one, match_two);
    

    let verificationStatus;
    if (maxMatch >= 0.85) {
      verificationStatus = true; // Auto-verified
    } else if (maxMatch >= 0.5) {
      verificationStatus = "review"; // Requires manual review
    } else {
      verificationStatus = false; // Mismatch
    }

    //Masking the PAN
    let masked_pan = "";
    for (let i = 0; i < pan_card_number.length; i++) {
      if (i % 2 == 0) {
        masked_pan = masked_pan + "X";
      } else {
        masked_pan = masked_pan + pan_card_number[i];
      }
    }

    const driverKYC = await DriverKYC.upsert({
      driver_id: req.driver.id, //ForeignKEY // //find with this one and rest will update
      pan_number: pan_card_number,
      is_pan_card_verified: verificationStatus,
      pan_full_name: panReponse.data.data.full_name,
      pan_api_response: panReponse.data, // Store raw API response for audit
      pan_similarity_score: maxMatch,
      pan_number_masked: masked_pan,
    });

    return responseHandler(res, Status.CODES.SUCCESS, "PAN verification completed", {
      pan_verification_status: verificationStatus,
      similarity_score: maxMatch,
      driver_kyc: driverKYC,
      masked_pan_card: masked_pan,
      pan_card_number,
      pan_full_name: panReponse.data.data.full_name,
    });
  } catch (error) {
    console.log("Error in the verifyPanCard Controller--", error);
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in verifyPanCard Controller",
      error
    );
  }
};

const uploadPanCard = async (req, res) => {
  try {
    const filePath = req.file.path;
    if (!filePath) {
      return errorHandler(res, Status.CODES.BAD_REQUEST, "No File uploaded");
    }
    const panCardImageURL = await uploadOnCloudinary(filePath);
    const imageUrl = panCardImageURL.secure_url; // string URL

    const driverKYC = await DriverKYC.findOne({
      where: {
        driver_id: req.driver.id,
      },
    });
    driverKYC.image_pan_card_image = imageUrl;
    driverKYC.save();
    const driver = await Driver.findByPk(req.driver.id);
    if (
      driverKYC.image_pan_card_image &&
      driverKYC.is_pan_card_verified &&
      driver.profile_stage == 2
    ) {
      driver.profile_stage = 3;
      await driver.save();
    }
    const response_data = {
      driver_id: req.driver.id,
      driverKYC,
    };
    return responseHandler(
      res,
      Status.CODES.SUCCESS,
      "Uploaded Pan Card Image Successfully!",
      response_data
    );
  } catch (error) {
    console.log("Error in the uploadPanCard Controller ", error);
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in uploadPanCard Controller",
      error
    );
  }
};

const verifyDrivingLicense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorHandler(
        res,
        Status.CODES.BAD_REQUEST,
        "Validation Failed",
        errors.array()
      );
    }
    const { driving_license_number } = req.body;
    let dlReponse;
    const dlAPI = await DriverKYC.findOne({
      where: {
        driving_license_number: driving_license_number,
      },
    });

    if (dlAPI) {
      dlReponse = dlAPI.dl_api_response.data;
    } else {
      dlReponse = await verifyDrivingLicenseViaAPI(
        driving_license_number,
        req.driver.dob
      );
    }
    const driver = await Driver.findByPk(req.driver.id);
    const full_name_one = `${driver.first_name} ${driver.last_name}`
      .toLowerCase()
      .trim();
    const full_name_two = `${driver.last_name} ${driver.first_name}`
      .toLowerCase()
      .trim();
    const apiName = dlReponse.data.data.name.toLowerCase().trim();

    const match_one = stringSimilarity.compareTwoStrings(
      apiName,
      full_name_one
    );
    const match_two = stringSimilarity.compareTwoStrings(
      apiName,
      full_name_two
    );

    const maxMatch = Math.max(match_one, match_two);
   

    let verificationStatus;
    if (maxMatch >= 0.85) {
      verificationStatus = true; // Auto-verified
    } else if (maxMatch >= 0.5) {
      verificationStatus = "review"; // Requires manual review
    } else {
      verificationStatus = false; // Mismatch
    }

    let existing = await DriverKYC.findOne({
      where: { driver_id: req.driver.id },
    });

    if (existing) {
      await existing.update({
        driving_license_number,
        is_driving_license_verified: verificationStatus,
        dl_full_name: dlReponse.data.data.name,
        dl_api_response: dlReponse.data.data,
        dl_similarity_score: maxMatch,
      });
    }
    return responseHandler(res, Status.CODES.SUCCESS, "DL verification completed", {
      is_driving_license_verified: verificationStatus,
      dl_similarity_score: maxMatch,
      driver_kyc: existing,
    });
  } catch (error) {
    console.log("Error in the verifyDriving Controller-----------", error);
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in verifyDrivingLicense Controller",
      error
    );
  }
};

const uploadFrontDrivingLicense = async (req, res) => {
  try {
    const filePath = req.file.path;
    if (!filePath) {
      return errorHandler(res, Status.CODES.BAD_REQUEST, "No File uploaded");
    }
    const frontSideImageURL = await uploadOnCloudinary(filePath);
    const imageUrl = frontSideImageURL.secure_url; // string URL

    const driverKYC = await DriverKYC.findOne({
      where: {
        driver_id: req.driver.id,
      },
    });
    driverKYC.image_url_front_driving_license = imageUrl;
    driverKYC.save();
    const response_data = {
      driver_id: req.driver.id,
      driverKYC,
    };
    return responseHandler(
      res,
      Status.CODES.SUCCESS,
      "Uploaded DL Front Image Successfully!",
      response_data
    );
  } catch (error) {
    console.log("Error in the uploadFrontDrivingLicense Controller", error);
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in uploadFrontDrivingLicense Controller",
      error
    );
  }
};

const uploadBackDrivingLicense = async (req, res) => {
  try {
    const filePath = req.file.path;
    if (!filePath) {
      return errorHandler(res, Status.CODES.BAD_REQUEST, "No File uploaded");
    }
    const backSideImageURL = await uploadOnCloudinary(filePath);
    const imageUrl = backSideImageURL.secure_url; // string URL

    const driverKYC = await DriverKYC.findOne({
      where: {
        driver_id: req.driver.id,
      },
    });
    driverKYC.image_url_back_driving_license = imageUrl;
    driverKYC.save();
    const driver = await Driver.findByPk(req.driver.id);
    if (
      driverKYC.image_url_back_driving_license &&
      driverKYC.image_url_back_driving_license &&
      driverKYC.is_driving_license_verified &&
      driver.profile_stage == 3
    ) {
      driver.profile_stage = 4;
      await driver.save();
    }
    const response_data = {
      driver_id: req.driver.id,
      driverKYC,
    };
    return responseHandler(
      res,
      Status.CODES.SUCCESS,
      "Uploaded DL Back Image Successfully!",
      response_data
    );
  } catch (error) {
    console.log("Error in the uploadBackDrivingLicense Controller", error);
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in uploadBackDrivingLicense Controller",
      error
    );
  }
};

module.exports = {
  driverProfile,
  driverVehicle,
  verifyPanCard,
  verifyDrivingLicense,
  uploadFrontDrivingLicense,
  uploadBackDrivingLicense,
  uploadPanCard,
};
