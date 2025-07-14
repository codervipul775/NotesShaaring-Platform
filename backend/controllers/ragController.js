const axios = require("axios");
const pdfParse = require("pdf-parse");
const { askGeminiFallback } = require("../utils/fallbackSummarizer"); 
async function summarizeText(fileUrl) {
  console.log("Calling summarizeText with fileUrl:", fileUrl);

  try {
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf"
      }
    });

    const pdfData = await pdfParse(response.data);
    const text = pdfData.text;

    console.log("[PDF PARSE] Extracted (magic) text length:", text.length);
    console.log("[PDF PREVIEW]", text.slice(0, 500));
    const summary = await askGeminiFallback(text); 
    return summary;

  } catch (err) {
    console.error("summarizeText failed:", err.message);
    return "Could not read or summarize the file.";
  }
}

module.exports = { summarizeText };
