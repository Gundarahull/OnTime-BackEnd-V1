const Status = require("../../config/statusCode");
const errorHandler = require("../../handlers/errorHandler");
const responseHandler = require("../../handlers/responseHandler");
const { encryptPassword } = require("../../helper/encrypt_decrypt");
const SuperAdmin = require("../../models/superAdmin/auth/superAdmin.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SuperAdminRegister = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return errorHandler(
    //     res,
    //     Status.CODES.BAD_REQUEST,
    //     "Validation Failed",
    //     errors.array()
    //   );
    // }

    const { first_name, last_name, email, username, password } = req.body;
    const emailCheck = await SuperAdmin.findOne({
      where: {
        email,
      },
    });
    if (emailCheck) {
      return errorHandler(
        res,
        Status.CODES.CONFLICT,
        "Nah! Email Already Found!"
      );
    }

    const userNameCheck = await SuperAdmin.findOne({
      where: {
        username,
      },
    });

    if (userNameCheck) {
      return errorHandler(
        res,
        Status.CODES.CONFLICT,
        "Nah! UserName Already Found! Please Try New ONE"
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const superAdmin = await SuperAdmin.create({
      first_name,
      last_name,
      email,
      username,
      password: hashedPassword,
      role_Id: 1,
    });
    return responseHandler(
      res,
      Status.CODES.CREATED,
      "Super Admin Create Successfully",
      superAdmin
    );
  } catch (error) {
    console.log("error in the superAdmin-------------", error);

    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in SuperAdminRegister Controller",
      error
    );
  }
};

const superAdminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userNameCheck = await SuperAdmin.findOne({
      where: {
        username,
      },
    });

    if (!userNameCheck) {
      return errorHandler(
        res,
        Status.CODES.CONFLICT,
        "Nah! UserName Doesnt Exist!"
      );
    }

    const isMatch = await bcryptjs.compare(password, userNameCheck.password);
    if (!isMatch) {
      return errorHandler(
        res,
        Status.CODES.BAD_REQUEST,
        "Password is Incorrect, Please Try Again"
      );
    }
    //need to create Token...
    const token = jwt.sign(
      { id: userNameCheck.id, role_Id: userNameCheck.role_Id },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Cookie expiry of 7 days
      httpOnly: true,
      sameSite: "strict", // Prevent CSRF attacks
    });
    return responseHandler(
      res,
      Status.CODES.SUCCESS,
      "Super Admin Logined Successfully",
      {
        token,
        user: userNameCheck,
      }
    );
  } catch (error) {
    console.log("error in the superAdminLogin-------------", error);

    return errorHandler(
      res,
      Status.CODES.INTERNAL_SERVER_ERROR,
      "Error in superAdminLogin Controller",
      error
    );
  }
};

module.exports = {
  SuperAdminRegister,
  superAdminLogin,
};
