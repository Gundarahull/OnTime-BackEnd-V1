const axios = require("axios");
const { PAN_CARD_VERIFICATION, DRIVING_LISCENCE_VERIFICATION } = require("../../config/env");

const verifyPanViaAPI = async (pan_number) => {
  try {
    const response = await axios.post(
      PAN_CARD_VERIFICATION.API,
      { id_number: pan_number },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAN_CARD_VERIFICATION.TOKEN}`,
        },
        timeout: 7000, // ✅ Avoid hanging connections
      }
    );

    if (response?.data?.success) {
      return {
        success: true,
        data: response.data,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: response?.data?.message || "PAN verification failed",
    };
  } catch (err) {
    if (err.response) {
      return {
        success: false,
        data: null,
        error:
          err.response.data?.message ||
          `Third-party API error: ${err.response.status}`,
      };
    } else if (err.request) {
      return {
        success: false,
        data: null,
        error: "No response from PAN verification API",
      };
    } else {
      return {
        success: false,
        data: null,
        error: err.message || "Unknown PAN verification error",
      };
    }
  }
};

const verifyDrivingLicenseViaAPI = async (dl_number, dob) => {
  try {
    const response = await axios.post(
      DRIVING_LISCENCE_VERIFICATION.API,
      { id_number: dl_number, dob: dob },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAN_CARD_VERIFICATION.TOKEN}`,
        },
        timeout: 7000, // ✅ Avoid hanging connections
      }
    );

    if (response?.data?.success) {
      return {
        success: true,
        data: response.data,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: response?.data?.message || "Driving License verification failed",
    };
  } catch (err) {
    if (err.response) {
      return {
        success: false,
        data: null,
        error:
          err.response.data?.message ||
          `Third-party API error: ${err.response.status}`,
      };
    } else if (err.request) {
      return {
        success: false,
        data: null,
        error: "No response from Driving License verification API",
      };
    } else {
      return {
        success: false,
        data: null,
        error: err.message || "Unknown Driving License verification error",
      };
    }
  }
};

module.exports = { verifyPanViaAPI, verifyDrivingLicenseViaAPI };
