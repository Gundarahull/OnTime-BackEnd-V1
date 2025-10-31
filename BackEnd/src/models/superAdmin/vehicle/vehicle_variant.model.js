const { DataTypes } = require("sequelize");
const connectDB = require("../../../config/dbConfig");

const VehicleVariant = connectDB.define(
  "vehicle_variant",
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
    vehicle_model_id: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: "vehicle_model",
        },
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    image_url: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  { timestamps: true, tableName: "vehicle_variant" }
);

module.exports = VehicleVariant;
