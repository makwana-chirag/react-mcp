require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    // ✅ Correct model path: "models/gemini-pro"
    // const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });
    const models = await genAI.listModels();
    const model = genAI.getGenerativeModel({ model: "models/available-model" });

    console.log("🚀 ~ app.post ~ model:", model);

    const result = await model.generateContent(
      `Write a React component: ${prompt}`
    );
    const response = await result.response;
    const code = response.text();

    res.json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate code using Gemini" });
  }
});

app.listen(5000, () => {
  console.log("MCP Server running on http://localhost:5000");
});
