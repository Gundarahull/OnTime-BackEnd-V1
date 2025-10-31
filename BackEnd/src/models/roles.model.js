const { DataTypes } = require("sequelize");
const connectDB = require("../config/dbConfig");

const Role = connectDB.define(
  "role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    underscored: true,
    timestamps: true,
    tableName: "roles", //1st Priortity than the 'role' while defining the table....
  }
);

module.exports = Role;
