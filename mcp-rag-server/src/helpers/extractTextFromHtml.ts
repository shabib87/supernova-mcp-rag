import * as fs from 'fs';
import * as cheerio from 'cheerio';

export const extractTextFromHtml = (filePath: string) => {
  // Function to extract text from HTML
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);
  // Remove script, style, and nav elements
  $('script, style, nav, footer, header').remove();
  // Get text and clean it up
  return $('body')
    .text()
    .replace(/\s+/g, ' ') // Replace multiple spaces/newlines with single space
    .replace(/\n/g, ' ') // Replace newlines with space
    .replace(/\t/g, ' ') // Replace tabs with space
    .replace(/\r/g, ' ') // Replace carriage returns with space
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
    .trim();
};
