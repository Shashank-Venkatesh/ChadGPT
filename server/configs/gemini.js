import { GoogleGenerativeAI } from "@google/generative-ai";


const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default genai;