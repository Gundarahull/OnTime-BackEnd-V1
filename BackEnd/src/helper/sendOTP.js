const msgConfig = require("../config/msgConfig");
const MSG91 = require("msg91-api")(msgConfig.AUTHKEY);

const sendOTP = async (mobile_number, username, OTP, role_Id) => {
  if (username.includes(null) && role_Id == 2) {
    username = "OnTime Captain";
  }

  const arg = {
    flow_id: msgConfig.FLOW_ID_FOR_OTP,
    sender: msgConfig.SENDER,
    mobiles: mobile_number,
    EVPS_USERNAME: username,
    EVPS_SIGNIN_OTP: OTP,
    EVPS_CRM_EMAIL: msgConfig.EVPS_CRM_EMAIL,
    EVPS_CRM_PHONE: msgConfig.EVPS_CRM_PHONE,
    EVPS_URL_TC: msgConfig.EVPS_URL_TC,
  };

  const SmsCheck = await MSG91.sendSMS(arg);
};

module.exports = sendOTP;
