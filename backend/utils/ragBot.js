const axios = require("axios");
const pdfParse = require("pdf-parse");
async function askRagBot(fileUrl, userQuery) {
  try {
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      headers: { Accept: "application/pdf" },
    });
    const pdfData = await pdfParse(response.data);
    const text = pdfData.text;
    const prompt = `Answer this question based on the document content:\n\n"${userQuery}"\n\nDocument:\n${text.slice(0, 4000)}`;
    const ollamaResponse = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt,
      stream: false,
    });
    return ollamaResponse.data.response.trim();
  } catch (err) {
    console.error("askRagBot error:", err.message);
    return "⚠️ Failed to answer question using document.";
  }
}

module.exports = askRagBot;
