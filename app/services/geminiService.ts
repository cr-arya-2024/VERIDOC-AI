
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../lib/types";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAHT77zs1i9MlZYGXhDXL6XvAXPoKu1jso");
async function checkModels() {
  const models = await genAI.listModels();
  console.log(models);
  // This will print the exact strings (e.g., "models/gemini-3-pro") 
  // you are allowed to use.
}
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const analyzeVerilogCode = async (code: string): Promise<AnalysisResult> => {
  const ai = getAIClient();

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following Verilog code and provide a structured JSON report. 
    Code:
    \`\`\`verilog
    ${code}
    \`\`\``,
    config: {
      systemInstruction: "You are a world-class Hardware Description Language (HDL) expert specializing in Verilog, SystemVerilog, and FPGA synthesis. Your task is to analyze Verilog modules for correctness, performance, and documentation.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          moduleName: { type: Type.STRING },
          description: { type: Type.STRING, description: "Short description of what the module does" },
          ports: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["input", "output", "inout"] },
                width: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["name", "type", "width", "description"]
            }
          },
          synthesisNotes: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          complexity: {
            type: Type.OBJECT,
            properties: {
              estimatedGates: { type: Type.STRING },
              fsmDetected: { type: Type.BOOLEAN },
              clockDomains: { type: Type.NUMBER }
            },
            required: ["estimatedGates", "fsmDetected", "clockDomains"]
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          summary: { type: Type.STRING, description: "Executive summary of the design quality" }
        },
        required: ["moduleName", "description", "ports", "synthesisNotes", "complexity", "suggestions", "summary"]
      },
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No analysis received from AI.");

  return JSON.parse(text.trim()) as AnalysisResult;
};
