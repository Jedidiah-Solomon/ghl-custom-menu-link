import dotenv from "dotenv";
import axios from "axios";
import qs from "qs";

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

    console.log(
      "OAuth token exchange completed for locationId:",
      tokenResponse.data?.locationId || null
    );
    console.log("Full tokenResponse:", tokenResponse);
    console.log("tokenResponse.data:", tokenResponse.data);
    console.log(
      "tokenResponse.data (JSON):",
      JSON.stringify(tokenResponse.data, null, 2)
    );

    res.status(200).json({
      message: "Callback and token exchange successful. Data not saved.",
    });

    console.log("OAuth token exchange successful (data not saved).");
  } catch (error) {
    console.error(" Error details: ", error);
    console.error(
      " Error during OAuth token exchange:",
      error.toJSON ? error.toJSON() : error.message
    );

    return res.status(500).json({
      error: "Failed to exchange code for token.",
    });
  }
}

export { initiate, callback };
