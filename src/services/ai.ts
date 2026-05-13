import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationRequest } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export const aiService = {
  async getCourseRecommendations(request: RecommendationRequest) {
    const ai = getAI();
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
              description: { type: Type.STRING, description: "Detailed overview of what the course covers" },
              benefits: { type: Type.STRING, description: "How this course helps the student's career" },
              jobDemand: { type: Type.STRING, description: "Information about current market demand for this qualification" },
              duration: { type: Type.STRING, description: "Typical duration (e.g., 3 years full-time)" },
              alternativePathway: { type: Type.STRING, description: "Only if APS is marginal" },
              careerAlignment: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["courseName", "faculty", "matchingReason", "description", "benefits", "jobDemand", "duration", "careerAlignment"]
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("Failed to get a response from the AI service.");
    }

    return JSON.parse(response.text);
  },

  async askAssistant(query: string, context?: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: `You are the CSAS (Campus Smart Assistance System) virtual assistant specifically for Tshwane University of Technology (TUT) Soshanguve South Campus. 
        You help students with course info (especially ICT and Humanities), building navigation (e.g., Building 10, Building L, Building 21), and departmental contacts at TUT. 
        Refer to the campus as "Sosh South" or "Soshanguve South Campus".
        Be professional, helpful, and concise. ${context ? `Context: ${context}` : ''}`
      }
    });
    return response.text;
  },

  async getCampusInsights() {
    const ai = getAI();
    const prompt = "Generate 3 short, creative 'Campus Insights' for TUT Soshanguve South students. These should sound like bulleted news items or tips about campus life, admin deadlines, or academic advice. Keep them concise and relevant to Sosh South.";
    
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
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["News", "Tip", "Deadline"] }
            },
            required: ["title", "content", "type"]
          }
        }
      }
    });

    if (!response.text) return [];
    return JSON.parse(response.text);
  },

  async getSmartNavigation(query: string) {
    const ai = getAI();
    const prompt = `Translate this student's navigation request into a specific building or location at TUT Soshanguve South: "${query}".
    Buildings available: Building 10 (ICT), Building L (Humanities), Building 21 (Admin/Library), Student Center, Cafeteria.
    If multiple, pick the best one.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            explanation: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["destination", "explanation"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Failed to generate navigation data.");
    }
    return JSON.parse(response.text);
  }
};
