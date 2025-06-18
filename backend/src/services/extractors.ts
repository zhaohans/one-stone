import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs';

export const extractTextFromPDF = async (filePath: string) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

export const extractTextFromDOCX = async (filePath: string) => {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}; 