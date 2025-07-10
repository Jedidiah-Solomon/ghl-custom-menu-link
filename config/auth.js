import dotenv from "dotenv";
import axios from "axios";
import qs from "qs";
import { encryptPaymentKey } from "../utils/helper.js";
import { adminFirestore } from "./firebase-admin.js";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

/**
 * Step 1: Initiate GHL OAuth Flow
 * Redirects to HighLevel's chooselocation screen
 */
async function initiate(req, res) {
  const options = {
    requestType: "code",
    redirectUri: process.env.GHL_REDIRECT_URL,
    clientId: process.env.JVN_CLIENT_ID,
    scopes: [
      "oauth.write",
      "oauth.readonly",
      "custom-menu-link.readonly",
      "custom-menu-link.write",
    ],
  };

  const client_id = process.env.JVN_CLIENT_ID;
  const redirect_url = process.env.GHL_REDIRECT_URL;

  console.log("App initiation kicked-off");
  console.log("Client Id: ", client_id);
  console.log("Redirect url: ", redirect_url);

  return res.redirect(
    `${process.env.GHL_BASE_URL}/oauth/chooselocation?response_type=${
      options.requestType
    }&redirect_uri=${options.redirectUri}&client_id=${
      options.clientId
    }&scope=${options.scopes.join(" ")}&loginWindowOpenMode=self`
  );
}

/**
 * Step 2: Handle OAuth Callback
 * Exchanges authorization code for access token
 */
async function callback(req, res) {
  console.log("Redirect URI:", process.env.GHL_REDIRECT_URL);
  console.log("Authorization code received:", req.query.code);

  const tokenData = qs.stringify({
    client_id: process.env.JVN_CLIENT_ID,
    client_secret: process.env.JVN_CLIENT_SECRET,
    grant_type: "authorization_code",
    code: req.query.code,
    user_type: "Company",
    redirect_uri: process.env.GHL_REDIRECT_URL,
  });

  const tokenConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.GHL_OAUTH_TOKEN_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: tokenData,
  };

  try {
    const tokenResponse = await axios.request(tokenConfig);
    const {
      access_token,
      refresh_token,
      token_type,
      expires_in,
      companyId,
      userId,
      scope,
      planId,
    } = tokenResponse.data;

    if (!companyId) {
      return res
        .status(400)
        .json({ error: "CompanyId missing in token response." });
    }

    const encryptionKey = process.env.JVN_ENCRYPTION_SECRET_KEY;
    const accessTokenEncryption = encryptPaymentKey(
      access_token,
      encryptionKey
    );
    const refreshTokenEncryption = encryptPaymentKey(
      refresh_token,
      encryptionKey
    );

    // Save company-level access token
    await adminFirestore
      .collection("companyAccessTokens")
      .doc(companyId)
      .set({
        companyId,
        accessToken: accessTokenEncryption.encryptedKey,
        accessTokenIv: accessTokenEncryption.iv,
        accessTokenAuthTag: accessTokenEncryption.authTag,
        refreshToken: refreshTokenEncryption.encryptedKey,
        refreshTokenIv: refreshTokenEncryption.iv,
        refreshTokenAuthTag: refreshTokenEncryption.authTag,
        tokenType: token_type,
        expiresIn: expires_in,
        userId: userId || "N/A",
        planId: planId || "N/A",
        scope,
        createdAt: new Date(),
      });

    console.log(`GHL OAuth data saved for company: ${companyId}`);

    return res.redirect("/home");
  } catch (error) {
    console.error(
      "Error during OAuth process:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      error: "Failed to complete OAuth process.",
    });
  }
}

export { initiate, callback };
