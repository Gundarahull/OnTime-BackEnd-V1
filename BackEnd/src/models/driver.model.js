const { DataTypes } = require("sequelize");
const connectDB = require("../config/dbConfig");

const Driver = connectDB.define(
  "driver",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: { len: [1, 100] },
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: { len: [1, 100] },
    },

    //LOGIN (userNam+passWord)
    username: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING, // hashed password
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      validate: { isEmail: true }, //checking its in the valid fomat or not
    },
    email_otp: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    is_email_otp_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    email_otp_expires: {
      type: DataTypes.DATE,
    },

    mobile_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      validate: { len: [10, 15] },
    },
    mobile_otp: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    otp_expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_mobile_otp_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    otp_requested_at: {
      type: DataTypes.DATE,
    },

    login_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    device_fingerprint: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    signup_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    city: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    languages_spoken: {
      type: DataTypes.ARRAY(DataTypes.STRING), // array of strings
      defaultValue: [],
    },

    gender: {
      type: DataTypes.STRING,
      defaultValue: "",
    },

    profile_stage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    is_dl_profile_verified: {
      //to restrict the first and last name if verified....
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    dob: {
      type: DataTypes.DATEONLY,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Foregin KEY
    role_Id: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: "roles",
        },
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    underscored: true, // created_at, updated_at instead of camelCase
    timestamps: true,
    tableName: "drivers", // explicitly set table name
  }
);

module.exports = Driver;
