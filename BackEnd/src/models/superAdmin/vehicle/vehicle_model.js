const { DataTypes } = require("sequelize");
const connectDB = require("../../../config/dbConfig");

const VehicleModel = connectDB.define(
  "vehicle_model",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    vehicle_brand_id: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: "vehicle_brand",
        },
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  { timestamps: true, tableName: "vehicle_model" }
);

module.exports = VehicleModel;
