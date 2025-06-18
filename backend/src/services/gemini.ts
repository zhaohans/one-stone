import { VertexAI } from '@google-cloud/vertexai';

const vertexAI = new VertexAI({ project: 'YOUR_PROJECT_ID', location: 'us-central1' });

export const extractTagsWithGemini = async (text: string) => {
  const model = vertexAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: `Extract tags, entities, and suggest a category for this document:\n${text}` }] }]
  });
  // Parse result as needed
  return result;
}; 