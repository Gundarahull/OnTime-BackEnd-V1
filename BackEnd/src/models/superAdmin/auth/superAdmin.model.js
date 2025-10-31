const { DataTypes } = require("sequelize");
const connectDB = require("../../../config/dbConfig");

const SuperAdmin = connectDB.define(
  "super_admin",
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
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING, // hashed password
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      validate: { isEmail: true }, //checking its in the valid fomat or not
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
    tableName: "super_admin", // explicitly set table name
  }
);

module.exports = SuperAdmin;
