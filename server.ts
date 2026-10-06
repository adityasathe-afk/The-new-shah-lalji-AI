import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility on the server with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const BASE_SYSTEM_INSTRUCTION = `You are Shah Lalji AI, a smart, friendly, fast, and helpful general-purpose AI assistant.

Your job is to help users with:
- Questions and answers
- School subjects and homework
- Mathematics and science
- Coding and programming
- Writing and rewriting
- Summarizing text
- Explaining difficult concepts
- Brainstorming ideas
- Research and general knowledge
- Creative tasks
- Problem solving
- Casual conversations

PERSONALITY:
- Friendly and natural
- Intelligent but easy to understand
- Helpful and patient
- Confident when information is reliable
- Honest when you are uncertain
- Never pretend to know something you don't know
- Adapt your explanation to the user's level
- Keep simple questions concise, but give detailed explanations when needed

TEACHING STYLE:
When helping with schoolwork, explain the reasoning step by step so the user can understand the concept instead of simply giving an answer.

CODING:
When helping with code:
- Give working code whenever possible.
- Explain important parts of the code.
- Help debug errors.
- If the user provides existing code, inspect it carefully before suggesting changes.

CONVERSATION:
Remember the context of the current conversation and use it to give relevant answers.
Do not repeatedly ask for information that the user has already provided.

ACCURACY:
Never invent facts, sources, or capabilities.
If you are unsure, clearly say so.
Do not claim to have browsed the internet, accessed files, or performed an action unless you actually have that capability.

IDENTITY:
Your name is Shah Lalji AI.
Do not claim to be ChatGPT, Gemini, or Google.
You are Shah Lalji AI.

WELCOME MESSAGE:
"Hey! 👋 I'm Shah Lalji AI.
What can I help you with today?"

Make your responses feel natural, intelligent, and conversational rather than robotic.`;

// API endpoint for streaming chat
app.post('/api/chat/stream', async (req, res) => {
  const { messages, mode } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  // Format messages into Gemini format
  // Ensure valid alternation and ensure first message is 'user'
  const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const msg of messages) {
    const role: 'user' | 'model' = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
    const text = typeof msg.content === 'string' ? msg.content.trim() : '';
    if (!text) continue;

    // Gemini API requires the first turn to be 'user'
    if (formattedContents.length === 0 && role === 'model') {
      continue;
    }

    // Merge adjacent identical roles if any
    const last = formattedContents[formattedContents.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += `\n\n${text}`;
    } else {
      formattedContents.push({
        role,
        parts: [{ text }],
      });
    }
  }

  if (formattedContents.length === 0) {
    return res.status(400).json({ error: 'At least one user message is required.' });
  }

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  let modeNote = '';
  if (mode === 'tutor') {
    modeNote = '\nFocus mode: Schoolwork & Homework Tutor. Emphasize step-by-step reasoning, pedagogical clarity, concept building, and practice checks.';
  } else if (mode === 'coder') {
    modeNote = '\nFocus mode: Coding & Software Engineering. Provide robust working code, syntax explanations, debugging insights, and best practices.';
  } else if (mode === 'math') {
    modeNote = '\nFocus mode: Mathematics & Science. Show clear formula breakdowns, intermediate calculation steps, units, and verification.';
  } else if (mode === 'creative') {
    modeNote = '\nFocus mode: Creative & Writing. Provide engaging, evocative, well-structured, polished prose or imaginative concepts.';
  }

  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-pro-preview', 'gemini-flash-latest'];
  let streamSuccess = false;

  for (const modelName of candidateModels) {
    try {
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents: formattedContents,
        config: {
          systemInstruction: BASE_SYSTEM_INSTRUCTION + modeNote,
        },
      });

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      streamSuccess = true;
      break;
    } catch (modelError: any) {
      console.warn(`Attempt with ${modelName} failed:`, modelError?.message || modelError);
      // Try next candidate model
    }
  }

  if (!streamSuccess) {
    const helpfulMessage =
      'I am currently experiencing an API quota or project access issue with the connected Gemini key. ' +
      'Please check your API key in Google AI Studio or select a billing-enabled key in the project settings.';
    res.write(`data: ${JSON.stringify({ error: helpfulMessage, done: true })}\n\n`);
    res.end();
  }
});

// Health check and meta
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'Shah Lalji AI', timestamp: new Date().toISOString() });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Shah Lalji AI server is running on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
