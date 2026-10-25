import Groq from "groq-sdk";

const geminiApiKey = process.env.GEMINI_API_KEY;
const groqApiKey = process.env.GROQ_API_KEY;

if (!geminiApiKey && !groqApiKey) {
    console.warn("Neither GEMINI_API_KEY nor GROQ_API_KEY is defined in environment variables.");
}

const groq = new Groq({ apiKey: groqApiKey || "" });
const GROQ_MODEL = "qwen/qwen3.8-27b";
const GROQ_FALLBACK_MODELS = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];

/**
 * Call Google Gemini Flash API via direct REST endpoint
 */
async function callGemini(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

    // Use active Google Gemini models
    const models = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"];
    let lastError: Error | null = null;

    for (const model of models) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `${prompt}\n\nReturn ONLY a valid JSON object. Do not include markdown formatting or extra text.` }] }],
                    generationConfig: {
                        temperature: 0.7,
                        responseMimeType: "application/json",
                    },
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `Gemini API returned status ${res.status}`);
            }

            const data = await res.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            return jsonMatch ? jsonMatch[0] : rawText.replace(/```json|```/g, "").trim();
        } catch (err: any) {
            lastError = err;
            console.warn(`Gemini model ${model} failed, trying next...`, err?.message);
        }
    }

    throw lastError || new Error("Gemini API call failed");
}

/**
 * Centralized AI helper using Google Gemini Flash (if GEMINI_API_KEY is present) or Groq AI.
 */
export async function callAI(prompt: string, retryCount = 0, targetModel = GROQ_MODEL): Promise<string> {
    // 1. If GEMINI_API_KEY is defined, use Google Gemini Flash
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "") {
        try {
            return await callGemini(prompt);
        } catch (geminiError: any) {
            console.warn("Gemini API failed, falling back to Groq:", geminiError?.message);
        }
    }

    // 2. Fallback to Groq AI
    const maxRetries = 3;
    const strictPrompt = `${prompt}\n\nReturn ONLY a valid JSON object. Do not include markdown formatting, code blocks, or any extra text.`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: strictPrompt,
                },
            ],
            model: targetModel,
            temperature: 0.7,
            max_tokens: 8000,
        });

        const rawText = chatCompletion.choices[0]?.message?.content || "";
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const cleanText = jsonMatch ? jsonMatch[0] : rawText.replace(/```json|```/g, "").trim();
        return cleanText;

    } catch (error: any) {
        const is404ModelError = error?.status === 404 || 
                                error?.statusCode === 404 || 
                                error?.message?.includes("model_not_found") || 
                                error?.message?.includes("does not exist") ||
                                error?.message?.includes("decommissioned");

        if (is404ModelError) {
            const nextModel = GROQ_FALLBACK_MODELS.find(m => m !== targetModel);
            if (nextModel && retryCount < maxRetries) {
                console.warn(`Model '${targetModel}' not available. Falling back to '${nextModel}'...`);
                return callAI(prompt, retryCount + 1, nextModel);
            }
        }

        if ((error?.status === 429 || error?.statusCode === 429) && retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1500;
            console.log(`Groq rate limit hit (attempt ${retryCount + 1}), retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return callAI(prompt, retryCount + 1, targetModel);
        }

        console.error("Groq API Error:", {
            status: error?.status ?? error?.statusCode,
            message: error?.message,
            retryCount,
            targetModel,
        });

        if (error?.status === 429 || error?.statusCode === 429) {
            throw new Error("Groq API Rate Limit exceeded. Please wait a moment and try again.");
        }

        throw new Error(`AI Processing failed: ${error?.message || "Unknown error"}`);
    }
}
