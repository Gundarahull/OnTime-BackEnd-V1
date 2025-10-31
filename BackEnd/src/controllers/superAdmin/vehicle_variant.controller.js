const Status = require("../../config/statusCode");
const errorHandler = require("../../handlers/errorHandler");
const responseHandler = require("../../handlers/responseHandler");
const { VehicleVariant } = require("../../models/releations");
const VehicleModel = require("../../models/superAdmin/vehicle/vehicle_model");

const addVehicleVariant = async (req, res) => {
  try {
    //const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return errorHandler(
    //     res,
    //     Status.CODES.BAD_REQUEST,
    //     "Validation Failed",
    //     errors.array()
    //   );
    // }
    const { name, image_url, vehicle_brand_id, vehicle_model_id } = req.body;
    const capsName = name.toUpperCase();
    const modelCheck = await VehicleVariant.findOne({
      where: {
        name: capsName,
      },
    });
    if (modelCheck) {
      return errorHandler(
        res,
        Status.CODES.CONFLICT,
        "Nah! Vehicle Variant Already Found!"
      );
    }
    const model = await VehicleVariant.create({
      name: capsName,
      vehicle_brand_id: vehicle_brand_id,
      image_url: image_url ? image_url : "",
      vehicle_model_id: vehicle_model_id,
    });
    return responseHandler(
      res,
      Status.CODES.CREATED,
      "Vehicle Vraint Created Successfully!",
      model
    );
  } catch (error) {
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in addVehicleVariant Controller",
      error
    );
  }
};
const updateVehicleVaraiant = async (req, res) => {
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
      name,
      image_url,
      vehicle_brand_id,
      vehicle_model_id,
      vehicle_vraint_id,
    } = req.body;
    const capsName = name.toUpperCase();

    const varaintCheck = await VehicleVariant.findByPk(vehicle_vraint_id);
    if (!varaintCheck) {
      return errorHandler(
        res,
        Status.CODES.NOT_FOUND,
        "Nah! Vehicle Vraint Not Found!"
      );
    }
    varaintCheck.name = capsName || varaintCheck.name;
    varaintCheck.image_url = image_url || varaintCheck.image_url;
    varaintCheck.vehicle_brand_id =
      vehicle_brand_id || varaintCheck.vehicle_brand_id;
    varaintCheck.vehicle_model_id =
      vehicle_model_id || varaintCheck.vehicle_model_id;

    await varaintCheck.save();
    return responseHandler(
      res,
      Status.CODES.SUCCESS,
      "Vehicle Vraint Updated Successfully!",
      varaintCheck
    );
  } catch (error) {
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in updateVehicleVrainat Controller",
      error
    );
  }
};
const getAllVehicleVaraintsUnderModel = async (req, res) => {
  try {
    const { vehicle_model_id } = req.body;
    const allVaraints = await VehicleVariant.findAll({
      where: {
        vehicle_model_id: vehicle_model_id,
      },
      include: [
        { model: VehicleModel, attributes: ["id", "name", "image_url"] },
      ],
    });
    if (!allVaraints) {
      return errorHandler(
        res,
        Status.CODES.NOT_FOUND,
        "Nah! No Vehicle Varaints Found!"
      );
    }
    return responseHandler(
      res,
      Status.CODES.SUCCESS,
      "Vehicle Varainats Fetched Successfully!",
      allVaraints
    );
  } catch (error) {
    console.log("error in get varaint---------", error);

    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in getAllVehiceVaraintsUnderModel Controller",
      error
    );
  }
};

module.exports = {
  addVehicleVariant,
  updateVehicleVaraiant,
  getAllVehicleVaraintsUnderModel,
};
