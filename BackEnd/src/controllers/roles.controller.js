const Status = require("../config/statusCode");
const errorHandler = require("../handlers/errorHandler");
const responseHandler = require("../handlers/responseHandler");
const { createRoleService } = require("../service/roles.service");

const createRole = async (req, res) => {
  try {
    const { role_name, description } = req.body;

    const role = await createRoleService({ role_name, description });

    return responseHandler(
      res,
      Status.CODES.CREATED,
      "Role Created Succesfully",
      role
    );
  } catch (error) {
    return errorHandler(res, "createRole", error);
  }
};

module.exports = {
  createRole,
};
