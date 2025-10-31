const Role = require("../models/roles.model");

const createRoleService = async (data) => {
  try {
    const role = await Role.create({
      role_name: data.role_name,
      description: data.description,
    });
    if (role) {
      return role;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createRoleService,
};
