const { STATIC_KEY } = require("../config/env");
const crypto = require("crypto");

// Ensure STATIC_KEY is 32 bytes (64 hex characters) for AES-256
if (!STATIC_KEY) {
  throw new Error(
    "STATIC_KEY must be a 32-byte hex string (64 hex characters)"
  );
}

const encryptPassword = (password) => {
  const iv = crypto.randomBytes(16); // 16 bytes IV
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(STATIC_KEY, "hex"),
    iv
  );
  const encrypted = Buffer.concat([
    cipher.update(password, "utf8"),
    cipher.final(),
  ]);
  // Store IV + encrypted text separated by colon
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

const decryptPassword = (encryptedPassword) => {
  const [ivHex, encryptedHex] = encryptedPassword.split(":");
  if (!ivHex || !encryptedHex) {
    throw new Error("Invalid encrypted password format");
  }
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(STATIC_KEY, "hex"),
    iv
  );
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
};

module.exports = {
  encryptPassword,
  decryptPassword,
};
