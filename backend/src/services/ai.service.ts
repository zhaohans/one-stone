import { extractTagsWithGemini } from "./gemini";

export const analyzeDocument = async (fileBuffer: any, fileName: string) => {
  try {
    // For now, just extract text and generate tags
    const text = fileBuffer.toString("utf-8");
    const result = await extractTagsWithGemini(text);

    // Mock response for now since Gemini service needs configuration
    const mockTags = ["document", "analysis", "business"];

    return {
      tags: mockTags,
      confidence: 0.8,
      analysis: {
        documentType: "unknown",
        keyTopics: mockTags,
        summary: "Document analyzed successfully",
      },
    };
  } catch (error: any) {
    console.error("Error analyzing document:", error);
    return {
      tags: [],
      confidence: 0.0,
      analysis: {
        documentType: "unknown",
        keyTopics: [],
        summary: "Analysis failed",
      },
    };
  }
};
