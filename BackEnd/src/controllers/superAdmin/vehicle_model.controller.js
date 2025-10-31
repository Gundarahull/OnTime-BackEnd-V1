const Status = require("../../config/statusCode");
const errorHandler = require("../../handlers/errorHandler");
const responseHandler = require("../../handlers/responseHandler");
const { VehicleModel, VehicleBrand } = require("../../models/releations");

const addVehicleModel = async (req, res) => {
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
    const { name, image_url, vehicle_brand_id } = req.body;
    const capsName = name.toUpperCase();
    const modelCheck = await VehicleModel.findOne({
      where: {
        name: capsName,
      },
    });
    if (modelCheck) {
      return errorHandler(
        res,
        Status.CODES.CONFLICT,
        "Nah! Vehicle Model Already Found!"
      );
    }
    const model = await VehicleModel.create({
      name: capsName,
      vehicle_brand_id: vehicle_brand_id,
      image_url: image_url ? image_url : "",
    });
    return responseHandler(
      res,
      Status.CODES.CREATED,
      "Vehicle Brand Created Successfully!",
      model
    );
  } catch (error) {
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in addVehicleModel Controller",
      error
    );
  }
};
const updateVehicleModel = async (req, res) => {
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
    const { name, image_url, vehicle_brand_id, vehicle_model_id } = req.body;
    const capsName = name.toUpperCase();

    const modelCheck = await VehicleModel.findByPk(vehicle_model_id);
    if (!modelCheck) {
      return errorHandler(
        res,
        Status.CODES.NOT_FOUND,
        "Nah! Vehicle Model Not Found!"
      );
    }
    modelCheck.name = capsName || modelCheck.name;
    modelCheck.image_url = image_url || modelCheck.image_url;
    await modelCheck.save();
    return responseHandler(
      res,
      Status.CODES.SUCCESS,
      "Vehicle Model Updated Successfully!",
      brandCheck
    );
  } catch (error) {
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in updateVehiclebrand Controller",
      error
    );
  }
};
const getAllVehicleModelsUnderBrand = async (req, res) => {
  try {
    const { vehicle_brand_id } = req.body;
    const allModels = await VehicleModel.findAll({
      where: {
        vehicle_brand_id: vehicle_brand_id,
      },
      include: {
        model: VehicleBrand,
        attributes:["id","name"]
      },
    });
    if (!allModels) {
      return errorHandler(
        res,
        Status.CODES.NOT_FOUND,
        "Nah! No Vehicle Models Not Found!"
      );
    }
    return responseHandler(
      res,
      Status.CODES.SUCCESS,
      "Vehicle Model Fetched Successfully!",
      allModels
    );
  } catch (error) {
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in getAllVehicleModelsUnderbrand Controller",
      error
    );
  }
};

module.exports = {
  addVehicleModel,
  updateVehicleModel,
  getAllVehicleModelsUnderBrand,
};
