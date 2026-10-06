import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

if (!process.env.OPENROUTER_API_KEY) {
  console.error("ERROR: OPENROUTER_API_KEY is missing.");
  process.exit(1);
}

// AI API
app.post("/api/chat", async (req, res) => {
  try {
    const prompt = req.body.message;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Please provide a message."
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "system",
              content:
                "You are Shah Lalji AI, the AI assistant for Shah Lalji Nangpar Academy. " +
                "Answer questions clearly, helpfully, and accurately. " +
                "When asked who you are, say you are Shah Lalji AI. " +
                "Do not claim to be ChatGPT. " +
                "Keep answers appropriate for students."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 500
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "OpenRouter request failed"
      });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "The AI returned an empty response."
      });
    }

    res.json({ reply });

  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      error: error.message || "AI request failed"
    });
  }
});

// Serve React frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

// React/Vite fallback
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Render port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Shah Lalji AI running on port ${PORT}`);
});