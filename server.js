import "dotenv/config";
import express from "express";

const app = express();
app.use(express.json());

if (!process.env.OPENROUTER_API_KEY) {
  console.error("ERROR: OPENROUTER_API_KEY is missing from .env");
  process.exit(1);
}

app.post("/api/chat", async (req, res) => {
  try {
    const prompt = req.body.message;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Please provide a message."
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
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
    });

    const data = await response.json();

    console.log("OpenRouter response:", JSON.stringify(data, null, 2));

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

    res.json({
      reply: reply
    });

  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      error: error.message || "AI request failed"
    });
  }
});

app.listen(3000, () => {
  console.log("Shah Lalji AI server running on port 3000");
});