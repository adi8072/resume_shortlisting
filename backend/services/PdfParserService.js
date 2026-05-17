import fs from 'fs';
import { PDFParse } from 'pdf-parse';

export const extractTextFromPDF = async (filePath) => {
  let parser = null;
  try {
    const dataBuffer = fs.readFileSync(filePath);
    parser = new PDFParse({ data: dataBuffer });
    const data = await parser.getText();
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF: =====>', error);
    throw new Error(`Could not parse PDF file: ${error.message}`);
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
};

