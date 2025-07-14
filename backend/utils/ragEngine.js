const axios = require("axios");
async function getSummaryFromRag(text) {
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: `Summarize the following text:\n\n${text.slice(0, 4000)}`,
      stream: false,
    });

    return response.data.response.trim();
  } catch (error) {
    console.error("[OLLAMA RAG ERROR]:", error.message);
    return null;
  }
}
module.exports = { getSummaryFromRag };
