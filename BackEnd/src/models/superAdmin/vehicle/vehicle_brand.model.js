const { DataTypes } = require("sequelize");
const connectDB = require("../../../config/dbConfig");

const VehicleBrand = connectDB.define(
  "vehicle_brand",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image_url: {
      type: DataTypes.STRING,
        defaultValue: "",
    },
  },
  { timestamps: true, tableName: "vehicle_brand" }
);

module.exports = VehicleBrand;
