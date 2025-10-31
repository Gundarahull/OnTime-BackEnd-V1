// Documnets related to the Driver...

const { DataTypes } = require("sequelize");
const connectDB = require("../config/dbConfig");

const DriverKYC = connectDB.define(
  "driver_kyc",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    
    driver_id: {
      type: DataTypes.UUID,
      unique: true, // ✅ this is critical for upsert
      references: {
        model: {
          tableName: "drivers",
        },
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    pan_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pan_number_masked: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pan_full_name: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    is_pan_card_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pan_api_response: {
      type: DataTypes.JSON,
      defaultValue: "",
    },
    pan_similarity_score: {
      type: DataTypes.DECIMAL,
      defaultValue: 0.0,
    },
    image_pan_card_image: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    pan_card_verfied_at: {
      type: DataTypes.DATE,
    },
    
    //DL
    is_driving_license_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    driving_license_number: {
      type: DataTypes.STRING,
    },
    driving_license_expiry_date: {
      type: DataTypes.DATEONLY,
    },
    image_url_front_driving_license: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    image_url_back_driving_license: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    extracted_dl_number_from_image: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    dl_api_response: {
      type: DataTypes.JSON,
      defaultValue: "",
    },
    dl_similarity_score: {
      type: DataTypes.DECIMAL,
      defaultValue: 0.0,
    },
    dl_full_name: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  {
    underscored: true,
    timestamps: true,
    tableName: "driver_kyc",
    freezeTableName: true,
  }
);

module.exports = DriverKYC;
