import express from "express";
// import { getOAuth2Client } from "../config/google";

const router = express.Router();

// Generate Google OAuth URL
// router.get("/google/url", (req, res) => {
//   const oauth2Client = getOAuth2Client();
//   const scopes = [
//     "https://www.googleapis.com/auth/drive.file",
//     "https://www.googleapis.com/auth/drive.readonly",
//   ];

//   const url = oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: scopes,
//     prompt: "consent", // Force to get refresh token
//   });

//   res.json({ url });
// });

// Handle Google OAuth callback
// router.get("/google/callback", async (req, res) => {
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).json({ error: "No code provided" });
//   }

//   try {
//     const oauth2Client = getOAuth2Client();
//     const { tokens } = await oauth2Client.getToken(code as string);

//     // In a real application, you would:
//     // 1. Store these tokens securely
//     // 2. Associate them with the user's account
//     // 3. Set up proper session management

//     res.json({
//       success: true,
//       message: "Authentication successful",
//       tokens: {
//         access_token: tokens.access_token,
//         refresh_token: tokens.refresh_token,
//         scope: tokens.scope,
//         expiry_date: tokens.expiry_date,
//       },
//     });
//   } catch (error) {
//     console.error("Error getting tokens:", error);
//     res.status(500).json({ error: "Failed to get tokens" });
//   }
// });

export default router;
