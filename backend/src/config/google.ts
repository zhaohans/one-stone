import { OAuth2Client } from "google-auth-library";

const GOOGLE_CLIENT_ID =
  "309045407817-aoai5g4ure33bueen40k2l2nq8n73r1m.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  "http://localhost:3000/auth/google/callback";

if (!GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET environment variable is required");
}

export async function getGoogleCredentials() {
  const credentials = {
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT_URI,
    tokens: {
      access_token: process.env.GOOGLE_ACCESS_TOKEN,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      scope:
        process.env.GOOGLE_SCOPE ||
        "https://www.googleapis.com/auth/drive.file",
      token_type: "Bearer",
      expiry_date: parseInt(process.env.GOOGLE_TOKEN_EXPIRY || "0", 10),
    },
  };

  // Validate required credentials
  if (!credentials.tokens.access_token || !credentials.tokens.refresh_token) {
    throw new Error("Missing required Google tokens");
  }

  // Check if token needs refresh
  if (credentials.tokens.expiry_date < Date.now()) {
    const oauth2Client = new OAuth2Client(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri,
    );

    oauth2Client.setCredentials({
      refresh_token: credentials.tokens.refresh_token,
    });

    const response = await oauth2Client.refreshAccessToken();
    credentials.tokens = (response as any).tokens;
  }

  return credentials;
}

export function getOAuth2Client() {
  return new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
  );
}
