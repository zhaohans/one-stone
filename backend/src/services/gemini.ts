// import { VertexAI } from "@google-cloud/vertexai";
// const vertexAI = new VertexAI({
//   project: "chromatic-theme-463318-e0",
//   location: "us-central1",
// });
// console.log("[Gemini] GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
// console.log("[Gemini] GOOGLE_CLOUD_PROJECT:", process.env.GOOGLE_CLOUD_PROJECT);
// console.log("[Gemini] GCLOUD_PROJECT:", process.env.GCLOUD_PROJECT);
// console.log("[Gemini] NODE_ENV:", process.env.NODE_ENV);
// export const extractTagsWithGemini = async (text: string) => {
//   const model = vertexAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//   const result = await model.generateContent({
//     contents: [
//       {
//         role: "user",
//         parts: [
//           {
//             text: `Extract tags, entities, and suggest a category for this document:\n${text}`,
//           },
//         ],
//       },
//     ],
//   });
//   // Parse result as needed
//   return result;
// };
