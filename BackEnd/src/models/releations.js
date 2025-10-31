const VehicleBrand = require("./superAdmin/vehicle/vehicle_brand.model");
const VehicleModel = require("./superAdmin/vehicle/vehicle_model");
const VehicleVariant = require("./superAdmin/vehicle/vehicle_variant.model");

// One Brand has many Models
VehicleBrand.hasMany(VehicleModel, { foreignKey: "vehicle_brand_id" });

// One Model belongs to a Brand
VehicleModel.belongsTo(VehicleBrand, { foreignKey: "vehicle_brand_id" });

VehicleModel.hasMany(VehicleVariant, { foreignKey: "vehicle_model_id" });
VehicleVariant.belongsTo(VehicleModel, { foreignKey: "vehicle_model_id" });

//Rverse Theraphy

module.exports = {
  VehicleBrand,
  VehicleModel,
  VehicleVariant,
};
