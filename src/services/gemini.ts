import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (aiInstance) return aiInstance;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    throw new Error("API_KEY_MISSING: Gemini API Key is missing. Please configure your GEMINI_API_KEY to start using the AI tools.");
  }
  
  aiInstance = new GoogleGenAI({ apiKey });
  return aiInstance;
}

export type Message = {
  role: "user" | "model";
  text: string;
  image?: string; // Base64 string for images
};

export const geminiService = {
  // 1. General Chat
  async chat(history: Message[], newMessage: string) {
    try {
      // Convert history to format expected by SDK if needed, 
      // but for simple single-turn or stateless chat we can just use generateContent
      // For true chat, we use chats.create
      
      // We'll use a fresh chat for now to keep it simple, or maintain state in the component
      // Let's use the chat model for better context handling
      const chat = getAI().chats.create({
        model: "gemini-3.5-flash",
        history: history.map(h => ({
          role: h.role,
          parts: [{ text: h.text }],
        })),
      });

      const result = await chat.sendMessage({ message: newMessage });
      return result.text;
    } catch (error) {
      console.error("Chat error:", error);
      throw error;
    }
  },

  // 2. Image Generation
  async generateImage(prompt: string) {
    try {
      // Primary method: Use Interactions API with gemini-3.1-flash-image as requested
      const interaction = await getAI().interactions.create({
        model: "gemini-3.1-flash-image",
        input: prompt,
        response_modalities: ["image", "text"],
        generation_config: {
          image_config: {
            aspect_ratio: "1:1",
            image_size: "1K"
          }
        }
      });
      
      if (interaction.output_image && interaction.output_image.data) {
        const mimeType = interaction.output_image.mime_type || "image/png";
        return `data:${mimeType};base64,${interaction.output_image.data}`;
      }

      // Fallback: check steps in interaction
      for (const step of interaction.steps || []) {
        if (step.type === 'model_output') {
          const imageContent = step.content?.find(c => c.type === 'image');
          if (imageContent && imageContent.data) {
            const mimeType = imageContent.mime_type || 'image/png';
            return `data:${mimeType};base64,${imageContent.data}`;
          }
        }
      }

      throw new Error("No image was returned from the generator. Please try again.");
    } catch (error: any) {
      console.error("Primary image generation failed, trying fallback model:", error);
      
      // Fallback method: try generating content directly with gemini-2.5-flash-image if interaction is not supported/404ed
      try {
        const fallbackResponse = await getAI().models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: {
            parts: [{ text: prompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1"
            }
          }
        });
        
        const parts = fallbackResponse.candidates?.[0]?.content?.parts;
        if (parts) {
          for (const part of parts) {
            if (part.inlineData) {
              const mimeType = part.inlineData.mimeType || 'image/png';
              return `data:${mimeType};base64,${part.inlineData.data}`;
            }
          }
        }
      } catch (fallbackError: any) {
        console.error("Fallback image generation failed too:", fallbackError);
      }

      // If both fail, let's look at the error type and provide a high-quality human-readable error message
      const errorStr = String(error?.message || error).toLowerCase();
      if (errorStr.includes("404") || errorStr.includes("not_found") || errorStr.includes("not found")) {
        throw new Error("PREMIUM_MODEL_REQUIRED: The requested Image Generation model requires a Paid API Key with billing enabled. Please complete the Paid Model Flow in the AI Studio interface to activate it.");
      }
      
      throw error;
    }
  },

  // 4. Grounded Search
  async generateContentWithSearch(prompt: string) {
    try {
      const response = await getAI().models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });
      return response.text;
    } catch (error) {
      console.error("Search info error:", error);
      // Fallback to standard generation if search grounding fails (e.g. permission issues)
      try {
        const fallbackResponse = await getAI().models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
        });
        return fallbackResponse.text;
      } catch (fallbackErr) {
        throw fallbackErr;
      }
    }
  },
  async analyzeImage(base64Image: string, prompt: string) {
    try {
      // Extract mime type and data
      const matches = base64Image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      
      if (!matches || matches.length !== 3) {
        throw new Error("Invalid base64 image format");
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      
      const response = await getAI().models.generateContent({
        model: "gemini-3.5-flash",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            },
            { text: prompt }
          ]
        }
      });

      return response.text;
    } catch (error) {
      console.error("Vision error:", error);
      throw error;
    }
  }
};
