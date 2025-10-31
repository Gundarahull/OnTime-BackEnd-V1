const msgConfig = {
  AUTHKEY: process.env.AUTHKEY || "",
  FLOW_ID_FOR_OTP: process.env.FLOW_ID_FOR_OTP || "",
  FLOW_ID: process.env.FLOW_ID || "",
  SENDER: process.env.SENDER || "",
  EVPS_CRM_EMAIL: process.env.EVPS_CRM_EMAIL || "",
  EVPS_CRM_PHONE: process.env.EVPS_CRM_PHONE || "",
  EVPS_URL_TC: process.env.EVPS_URL_TC || "",
  EVPS_CRM_INWARDS_EMAIL: process.env.EVPS_CRM_INWARDS_EMAIL || "",
  EVPS_CRM_EMAIL_DOMAIN: process.env.EVPS_CRM_EMAIL_DOMAIN || "",

  //templates
  EVPS_SMS_CONTACT_FORM_V02: process.env.EVPS_SMS_CONTACT_FORM_V02 || "",
  EVPS_USER_SMS_SIGNIN_V_4: process.env.EVPS_USER_SMS_SIGNIN_V_4 || "",
  EMAIL_EVPITSTOP_CONTACT_FORM_ACK_V001:
    process.env.EMAIL_EVPITSTOP_CONTACT_FORM_ACK_V001 || "",
  EMAIL_CONTACTUS_SUPER_ADMIN: process.env.EMAIL_CONTACTUS_SUPER_ADMIN || "",
  EVPS_STN_ADMIN_SIGNUP_OTP_001:
    process.env.EVPS_STN_ADMIN_SIGNUP_OTP_001 || "",
};

module.exports = msgConfig;
