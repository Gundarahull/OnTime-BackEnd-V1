module.exports = {
  PAN_CARD_VERIFICATION: {
    API: process.env.PAN_CARD_VERIFICATION_API,
    TOKEN: process.env.PAN_CARD_VERIFICATION_TOKEN,
  },
  DRIVING_LISCENCE_VERIFICATION: {
    API: process.env.DRIVING_LISCENCE_VERIFICATION_API,
    TOKEN: process.env.PAN_CARD_VERIFICATION_TOKEN,
  },
  CLOUDINARY: {
    NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  STATIC_KEY: {
    KEY: process.env.STATIC_KEY,
  },
};
