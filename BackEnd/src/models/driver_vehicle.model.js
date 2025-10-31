const { DataTypes } = require("sequelize");
const connectDB = require("../config/dbConfig");

const DriverVehicle = connectDB.define(
  "driver_vehicle",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vehicle_brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: "vehicle_brand",
        },
        key: "id",
      },
    },
    vehicle_model_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: "vehicle_model",
        },
        key: "id",
      },
    },
    vehicle_varaiant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: "vehicle_variant",
        },
        key: "id",
      },
    },
    driver_id: {
      type: DataTypes.UUID,
      references: {
        model: {
          tableName: "drivers",
        },
        key: "id",
      },
      allowNull: false,
    },
    vehicle_registration_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url_front_vehicle_rc: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    image_url_back_vehicle_rc: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    vehicle_images_url: {
      type: DataTypes.ARRAY,
      defaultValue: [],
    },
    is_vehicle_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rc_api_response: {
      type: DataTypes.JSON,
      defaultValue: "",
    },
  },
  { tableName: "driver_vehicle", timestamps: true }
);

module.exports = DriverVehicle;
