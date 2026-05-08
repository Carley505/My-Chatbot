const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ["http://localhost:3000", "https://my-chatbot-three-zeta.vercel.app"] })); // Allow React app to talk to this server
app.use(express.json());

// Initialize OpenAI with API key from .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 👈 Key is safely stored here, hidden from users
});

// Chat endpoint — React app sends messages here
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages are required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // You can change to "gpt-4o" for more power
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: "You are a friendly and helpful website assistant. Answer questions clearly and concisely.",
        },
        ...messages, // All previous messages from the chat
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("OpenAI Error:", error.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});