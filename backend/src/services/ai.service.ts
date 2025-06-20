// import { extractTagsWithGemini } from "./gemini";

export const analyzeDocument = async (fileBuffer: any, fileName: string) => {
  // Mock implementation only
  const mockTags = ["document", "analysis", "business"];
  return {
    tags: mockTags,
    confidence: 0.8,
    analysis: {
      documentType: "unknown",
      keyTopics: mockTags,
      summary: "Document analyzed successfully (mock)",
    },
  };
};
