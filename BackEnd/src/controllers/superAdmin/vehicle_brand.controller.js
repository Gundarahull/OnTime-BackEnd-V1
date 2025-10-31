const Status = require("../../config/statusCode");
const errorHandler = require("../../handlers/errorHandler");
const responseHandler = require("../../handlers/responseHandler");
const VehicleBrand = require("../../models/superAdmin/vehicle/vehicle_brand.model");

const addVehiclebrand = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return errorHandler(
    //     res,
    //     Status.CODES.BAD_REQUEST,
    //     "Validation Failed",
    //     errors.array()
    //   );
    // }
    const { name, image_url } = req.body;
    const capsName = name.toUpperCase();
    const brandCheck = await VehicleBrand.findOne({
      where: {
        name: capsName,
      },
    });
    if (brandCheck) {
      return errorHandler(
        res,
        Status.CODES.CONFLICT,
        "Nah! Vehicle Brand Already Found!"
      );
    }
    const brand = await VehicleBrand.create({
      name: capsName,
    });
    return responseHandler(
      res,
      Status.CODES.CREATED,
      "Vehicle Brand Created Successfully!",
      brand
    );
  } catch (error) {
    console.log("Error in the addbehicle COntroller------", error);

    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in addVehiclebrand Controller",
      error
    );
  }
};
const updateVehiclebrand = async (req, res) => {
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
    const { name, image_url, vehicle_brand_id } = req.body;
    const capsName = name.toUpperCase();
    const brandCheck = await VehicleBrand.findByPk(vehicle_brand_id);
    if (!brandCheck) {
      return errorHandler(
        res,
        Status.CODES.NOT_FOUND,
        "Nah! Vehicle Brand Not Found!"
      );
    }
    brandCheck.name = capsName || brandCheck.name;
    brandCheck.image_url = image_url || brandCheck.image_url;
    await brandCheck.save();
    return responseHandler(
      res,
      Status.CODES.SUCCESS,
      "Vehicle Brand Updated Successfully!",
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
const getAllVehiclebrands = async (req, res) => {
  try {
    const allBrands = await VehicleBrand.findAll();
    if (!allBrands) {
      return errorHandler(
        res,
        Status.CODES.NOT_FOUND,
        "Nah! No Vehicle Brands Not Found!"
      );
    }
    return responseHandler(
      res,
      Status.CODES.SUCCESS,
      "Vehicle Brands Fetched Successfully!",
      allBrands
    );
  } catch (error) {
    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in getAllVehicleBrands Controller",
      error
    );
  }
};

module.exports = {
  addVehiclebrand,
  updateVehiclebrand,
  getAllVehiclebrands,
};
