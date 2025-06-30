require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `Write a React component: ${prompt}` },
      ],
    });

    const code = response.choices[0].message.content;
    res.json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate code" });
  }
});

app.listen(5000, () => {
  console.log("MCP Server running on http://localhost:5000");
});
