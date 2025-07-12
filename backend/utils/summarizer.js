const axios = require('axios');
const pdfParse = require('pdf-parse');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

async function extractTextFromUrl(url) {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = res.data;
    const contentType = res.headers['content-type'];

    console.log(`[TEXT EXTRACT] Content-Type: ${contentType}`);
    if (contentType && contentType.includes('pdf')) {
      const data = await pdfParse(buffer);
      console.log('[PDF PARSE] Extracted text length:', data.text.length);
      console.log('[PDF PREVIEW]', data.text.slice(0, 300));
      return data.text;
    }
    const magic = buffer.slice(0, 4).toString('utf8');
    if (magic === '%PDF') {
      const data = await pdfParse(buffer);
      console.log('[PDF PARSE] Extracted (magic) text length:', data.text.length);
      console.log('[PDF PREVIEW]', data.text.slice(0, 300));
      return data.text;
    }

    console.warn(`[TEXT EXTRACT] Unsupported or unknown file. Magic: "${magic}"`);
    return "";

  } catch (err) {
    console.error("[TEXT EXTRACT] Failed:", err.message);
    return "";
  }
}

const summarizeText = async (input) => {
  let text = input;

  if (typeof input === "string" && input.startsWith("http")) {
    console.log("[SUMMARY] Input is URL, extracting file content...");
    text = await extractTextFromUrl(input);
  }

  if (!text || text.trim().length < 20) {
    console.warn("[SUMMARY] Not enough content to summarize.");
    return "Summary not available";
  }

  if (!GEMINI_API_KEY) {
    console.warn("[GEMINI] No API key, returning fallback summary.");
    return text.split(" ").slice(0, 50).join(" ") + "...";
  }

  try {
    const prompt = `Summarize the following note in 2-3 sentences:\n\n${text}`;
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    const result = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (result) return result;

    console.error("[GEMINI] Unexpected response:", response.data);
    return text.split(" ").slice(0, 50).join(" ") + "...";
  } catch (err) {
    console.error("[GEMINI] Error:", err.message);
    return text.split(" ").slice(0, 50).join(" ") + "...";
  }
};

module.exports = summarizeText;
