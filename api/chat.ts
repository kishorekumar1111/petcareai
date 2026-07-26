import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req: any, res: any) {
  // CORS headers if needed, though Vercel handles same-origin
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.status(200).json({ response: response.text });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
}
