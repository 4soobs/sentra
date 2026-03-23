import { GoogleGenAI, Type } from "@google/genai";

export async function analyzeWebsiteClaims(url, content, userApiKey = null) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze the following website content for credibility and claims. 
  Website URL: ${url}
  Content: ${content.substring(0, 2000)}...
  
  Rate the credibility of the claims made on this website from 0 to 100.
  Provide a brief reasoning for the score.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Credibility score from 0-100" },
            reasoning: { type: Type.STRING, description: "Brief explanation of the score" }
          },
          required: ["score", "reasoning"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      score: result.score ?? 50,
      reasoning: result.reasoning ?? "Unable to analyze claims at this time.",
      usage: response.usageMetadata || { totalTokenCount: 0 }
    };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      score: 50,
      reasoning: "AI analysis encountered an error. Please try again later."
    };
  }
}
