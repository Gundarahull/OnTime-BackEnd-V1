const msgConfig = require("../config/msgConfig");
const https = require("https");

async function sendEmail({
  refId,
  customerName,
  email,
  contact_form,
  otp,
  role,
}) {
  const options = {
    method: "POST",
    hostname: "control.msg91.com",
    port: null,
    path: "/api/v5/email/send",
    headers: {
      accept: "application/json",
      authkey: msgConfig.AUTHKEY,
      "content-type": "application/JSON",
    },
  };
  let emailDetails = {};

  if (refId) {
    emailDetails = {
      recipients: [
        {
          to: [{ name: customerName, email: email }],
          cc: [
            { email: msgConfig.EVPS_CRM_INWARDS_EMAIL },
            { email: msgConfig.EVPS_CRM_EMAIL },
          ],
          variables: { referenceid: refId },
        },
      ],
      from: {
        name: "form_submission",
        email: `form_submission@${msgConfig.EVPS_CRM_EMAIL_DOMAIN}`,
      },
      domain: msgConfig.EVPS_CRM_EMAIL_DOMAIN,
      reply_to: [{ email: msgConfig.EVPS_CRM_EMAIL }],
      template_id: msgConfig.EMAIL_EVPITSTOP_CONTACT_FORM_ACK_V001,
    };
  } else if (contact_form) {
    emailDetails = {
      recipients: [
        {
          to: [{ email: msgConfig.EVPS_CRM_INWARDS_EMAIL }],
          // to: [{ email: "rangaswamy.g@reached.co.in" }],
          variables: {
            "EVPS-CONTACTUS-REFID": contact_form.contactusSubmissionUUID,
            "EVPS-CONTACTUS-DATETIME": contact_form.createdAt,
            "EVPS-CONTACTUS-CATEGORY": contact_form.category,
            "EVPS-USER-ROLE": role ? role : "NA",
            "EVPS-FIRST-NAME": contact_form.name,
            // 'EVPS-LAST-NAME': contact_form,
            "EVPS-CONTACTUS-NOTES": contact_form.summary,
            "EVPS-CONTACTUS-EMAIL": contact_form.email,
            "EVPS-CONTACTUS-ATTACH-S3-LINKS": contact_form.attachments
              ? contact_form.attachments.join(", ")
              : "NA",
            "EVPS-CONTACTUS-PHONENO": contact_form.primaryContactNumber,
            "EVPS-CONTACTUS-WHATSAPP": contact_form.whatsappNumber,
            "EVPS-CONTACTUS-LAT-LNG":
              contact_form.geo.coordinates[0] +
              "," +
              contact_form.geo.coordinates[1],
            "EVPS-CONTACTUS-ADDRESS": contact_form.address,
            "EVPS-CONTACTUS-MKTG-CONSENT":
              contact_form.isAgreeForMarketingPromotions
                ? "Agreed"
                : "Disagreed",
            "EVPS-CONTACTUS-REGD-USER": role ? "yes" : "No",
            "EVPS-CONTACTUS-SIGNEDIN-USER": role ? "yes" : "No",
          },
        },
      ],
      from: {
        name: "form_submission_data",
        email: `form_submission_data@${msgConfig.EVPS_CRM_EMAIL_DOMAIN}`,
      },
      domain: msgConfig.EVPS_CRM_EMAIL_DOMAIN,
      reply_to: [{ email: msgConfig.EVPS_CRM_EMAIL }],
      template_id: msgConfig.EMAIL_CONTACTUS_SUPER_ADMIN,
    };
  } else {
    emailDetails = {
      recipients: [
        {
          to: [{ name: customerName, email: email }],
          variables: {
            _EVPS_STN_ADMIN_FULL_NAME_: customerName,
            _EVPS_STN_ADMIN_SIGNUP_USER_OTP_: otp,
          },
        },
      ],
      from: {
        name: "email_verification_otp",
        email: `email_verify@${msgConfig.EVPS_CRM_EMAIL_DOMAIN}`,
      },
      domain: msgConfig.EVPS_CRM_EMAIL_DOMAIN,
      reply_to: [{ email: msgConfig.EVPS_CRM_EMAIL }],
      template_id: msgConfig.EVPS_STN_ADMIN_SIGNUP_OTP_001,
    };
  }  

  const requestBody = JSON.stringify(emailDetails);
  return new Promise((resolve, reject) => {
    const req = https.request(options, function (res) {
      const chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        const body = Buffer.concat(chunks);
        const responseBody = body.toString();
        resolve(responseBody);
      });
    });

    req.on("error", function (error) {
      reject(error);
    });

    req.write(requestBody);
    req.end();
  });
}

module.exports = sendEmail;
