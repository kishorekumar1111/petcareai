import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Provide the API key directly to GoogleGenAI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, petProfile } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured." });
    }

    const systemInstruction = `You are PetCare AI, an AI-powered virtual assistant that helps pet owners by answering questions, providing educational guidance, and offering personalized recommendations about pet care.
You are NOT a replacement for a licensed veterinarian. Always advise contacting a vet for serious medical or emergency issues.
The user is asking about their pet with the following profile:
- Type: ${petProfile.type}
- Name: ${petProfile.name}
- Breed: ${petProfile.breed}
- Age: ${petProfile.age}
- Weight: ${petProfile.weight}
- Gender: ${petProfile.gender}

Provide personalized, concise, and helpful advice based on this profile. Format responses clearly using Markdown. Include relevant tips (nutrition, grooming, training, exercise, etc.) when appropriate.`;

    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedMessages,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ response: response.text });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
