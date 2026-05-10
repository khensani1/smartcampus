import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationRequest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const aiService = {
  async getCourseRecommendations(request: RecommendationRequest) {
    const prompt = `Based on the following student profile, suggest 3-5 academic courses. 
    APS Score: ${request.apsScore}
    Subjects: ${request.subjects.map(s => `${s.name} (${s.score}%)`).join(', ')}
    Interests: ${request.interests.join(', ')}
    
    Provide recommendations that match the APS score and interests. If the APS is low, suggest alternative pathways.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              courseName: { type: Type.STRING },
              faculty: { type: Type.STRING },
              matchingReason: { type: Type.STRING },
              alternativePathway: { type: Type.STRING, description: "Only if APS is marginal" },
              careerAlignment: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["courseName", "faculty", "matchingReason", "careerAlignment"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  },

  async askAssistant(query: string, context?: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: `You are the CSAS (Campus Smart Assistance System) virtual assistant for a South African University. 
        You help students with course info, building navigation, and departmental contacts. 
        Be professional, helpful, and concise. ${context ? `Context: ${context}` : ''}`
      }
    });
    return response.text;
  }
};
