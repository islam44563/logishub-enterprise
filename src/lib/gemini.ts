import { GoogleGenAI } from '@google/genai';

// Initialize the official Google Gen AI Client SDK
const apiKey = process.env.GEMINI_API_KEY || 'placeholder-gemini-key';
export const ai = new GoogleGenAI({ apiKey });

// Helper to interact with Gemini 1.5 Flash safely in backend routines
export async function generateGeminiContent(prompt: string): Promise<string> {
  if (apiKey === 'placeholder-gemini-key') {
    // Elegant fallback simulator if API Key is not supplied on initial run
    console.log(`[GEMINI MOCK] Processing prompt: ${prompt.substring(0, 60)}...`);
    if (prompt.includes("structured JSON")) {
      return JSON.stringify({
        governorate: "Alexandria",
        city: "Smouha",
        neighborhood: "Victor Emmanuel",
        landmarks: "next to Smouha Club",
        address_valid: true
      });
    }
    return "Weather delay Alexandria Smouha Central Hub. Recipient contacted. Expected reschedule tomorrow morning.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    return response.text || '';
  } catch (error) {
    console.error('[GEMINI ERR]', error);
    throw new Error('AI Engine failed to compute text request.');
  }
}
