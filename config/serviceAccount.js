import dotenv from "dotenv";

dotenv.config();

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

const requiredEnvVariables = [
  "SACCT_TYPE",
  "SACCT_PROJECT_ID",
  "SACCT_PRIVATE_KEY",
  "SACCT_PRIVATE_KEY_ID",
  "SACCT_CLIENT_EMAIL",
  "SACCT_CLIENT_ID",
  "SACCT_AUTH_URI",
  "SACCT_TOKEN_URI",
  "SACCT_AUTH_PROVIDER_X509_CERT_URL",
  "SACCT_CLIENT_X509_CERT_URL",
  "SACCT_UNIVERSE_DOMAIN",
];

requiredEnvVariables.forEach((variable) => {
  if (!process.env[variable]) {
    console.error(`Missing environment variable: ${variable}`);
    process.exit(1);
  }
});

const privateKey = process.env.SACCT_PRIVATE_KEY.replace(/\\n/g, "\n");

const serviceAccount = {
  type: process.env.SACCT_TYPE,
  project_id: process.env.SACCT_PROJECT_ID,
  private_key_id: process.env.SACCT_PRIVATE_KEY_ID,
  private_key: privateKey,
  client_email: process.env.SACCT_CLIENT_EMAIL,
  client_id: process.env.SACCT_CLIENT_ID,
  auth_uri: process.env.SACCT_AUTH_URI,
  token_uri: process.env.SACCT_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.SACCT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.SACCT_CLIENT_X509_CERT_URL,
  universe_domain: process.env.SACCT_UNIVERSE_DOMAIN,
};

// console.log("service account is : ", serviceAccount);

export default serviceAccount;
