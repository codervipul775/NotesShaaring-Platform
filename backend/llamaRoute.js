const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt,
      stream: false
    });

    res.json({ response: response.data.response });
  } catch (err) {
    console.error("LLaMA chat error:", err.message);
    res.status(500).json({ error: "Failed to get response from LLaMA" });
  }
});

module.exports = router;
