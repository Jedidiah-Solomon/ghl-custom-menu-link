import crypto from "crypto";
import { validationResult } from "express-validator";

// Function to generate a random 32-character hexadecimal key
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  console.log(`Your secret key: ${secretKey}`);

  return secretKey;
};

const timeNow = () => {
  let now = new Date();
  return now.toLocaleString();
};

// Get Valid 32bytes key
const getValidKey = (jvnSecretKey) => {
  const key = Buffer.from(jvnSecretKey, "hex");
  if (key.length !== 32) {
    throw new Error("Invalid key length. Expected 32 bytes.");
  }
  console.log("Key passed is raw:", jvnSecretKey);
  console.log("Key passed is buffered:", key);
  return key;
};

// Encrypt sensitive payment key
const encryptPaymentKey = (paymentKey, jvnSecretKey) => {
  const iv = crypto.randomBytes(12);
  const validKey = getValidKey(jvnSecretKey);
  console.log("Key length before is (raw - characters):", jvnSecretKey.length); // 64 (characters)
  console.log("Key length after is (buffered - bytes):", validKey.length); // 32 (bytes)
  const cipher = crypto.createCipheriv("aes-256-gcm", validKey, iv);

  let encryptedKey = cipher.update(paymentKey, "utf8", "hex");
  encryptedKey += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");
  console.log("Keys encryption successful");
  console.log("the encryptedKey is: ", encryptedKey);
  return {
    encryptedKey,
    iv: iv.toString("hex"),
    authTag,
  };
};

// Decrypt sensitive payment key
const decryptPaymentKey = (encryptedData, jvnSecretKey) => {
  const { encryptedKey, iv, authTag } = encryptedData;

  console.log("Encrypted Key Length:", encryptedKey.length);

  console.log("Decryption Key:", jvnSecretKey);

  const validKey = getValidKey(jvnSecretKey);

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    validKey,
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decryptedKey = decipher.update(encryptedKey, "hex", "utf8");
  decryptedKey += decipher.final("utf8");
  console.log("decrypted key is: ", decryptedKey);
  return decryptedKey;
};

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: errors.array() });
  }
  next();
};

export {
  generateSecretKey,
  timeNow,
  encryptPaymentKey,
  decryptPaymentKey,
  handleValidationErrors,
};
