
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "../lib/types";

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
  return new GoogleGenerativeAI(apiKey);
};

export const analyzeVerilogCode = async (code: string): Promise<AnalysisResult> => {
  const ai = getAIClient();

  const GEN_MODEL = "gemini-1.5-flash"; // Use stable 1.5 flash

  const model = ai.getGenerativeModel({
    model: GEN_MODEL,
    systemInstruction: "You are a world-class Hardware Description Language (HDL) expert specializing in Verilog, SystemVerilog, and FPGA synthesis. Your task is to analyze Verilog modules for correctness, performance, and documentation. Return ONLY valid JSON.",
  });

  const response = await model.generateContent({
    contents: [{
      role: "user",
      parts: [{
        text: `Analyze the following Verilog code and provide a structured JSON report. 
    Code:
    \`\`\`verilog
    ${code}
    \`\`\``
      }]
    }],
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const text = response.response.text();
  if (!text) throw new Error("No analysis received from AI.");

  try {
    return JSON.parse(text.trim()) as AnalysisResult;
  } catch {
    console.error("Failed to parse Gemini JSON output:", text);
    throw new Error("Invalid analysis format received from AI.");
  }
};
