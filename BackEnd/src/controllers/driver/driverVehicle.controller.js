const { validationResult } = require("express-validator");
const DriverVehicle = require("../../models/driver_vehicle.model");
const errorHandler = require("../../handlers/errorHandler");
const Status = require("../../config/statusCode");

const addVehicle = async (req, res) => {
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

    const {
      vehicle_registration_number,
      vehicle_brand_id,
      vehicle_model_id,
      vehicle_variant_id,
    } = req.body;

    const vehicleCheck = await DriverVehicle.findOne({
      where: {
        vehicle_registration_no: vehicle_registration_number,
      },
    });
    if (vehicleCheck) {
      return errorHandler(
        res,
        Status.CODES.CONFLICT,
        `Vehicle with Regstration NO : ${vehicle_registration_number} already found`
      );
    }
    if (vehicleCheck.is_vehicle_verified) {
      //somethimg....
    }
    //Insert
    const vehicle = await DriverVehicle.create({
      vehicle_registration_number,
      vehicle_brand_id,
      vehicle_model_id,
      vehicle_variant_id,
    });
  } catch (error) {
    console.log("Error in the addVehicle Controller", error);
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in addVehicle Controller",
      error
    );
  }
};

module.exports = {
  addVehicle,
};
