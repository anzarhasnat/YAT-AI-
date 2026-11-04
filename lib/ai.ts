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
                signal: AbortSignal.timeout(12000),
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `${prompt}\n\nReturn ONLY a valid JSON object. Do not include markdown formatting or extra text.` }] }],
                    generationConfig: {
                        temperature: 0.3,
                        responseMimeType: "application/json",
                        thinkingConfig: { thinkingBudget: 0 }
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
 * Centralized AI helper using ultra-fast Groq LPU (~680ms) with fallback to Google Gemini Flash.
 */
export async function callAI(prompt: string, retryCount = 0, targetModel = GROQ_MODEL): Promise<string> {
    const maxRetries = 3;
    const strictPrompt = `${prompt}\n\nReturn ONLY a valid JSON object. Do not include markdown formatting, code blocks, or any extra text.`;

    // 1. Prioritize ultra-fast Groq LPU if API key is configured
    if (groqApiKey && groqApiKey.trim() !== "") {
        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: strictPrompt,
                    },
                ],
                model: targetModel,
                temperature: 0.3,
                max_tokens: 8000,
            });

            const rawText = chatCompletion.choices[0]?.message?.content || "";
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            const cleanText = jsonMatch ? jsonMatch[0] : rawText.replace(/```json|```/g, "").trim();
            if (cleanText) return cleanText;

        } catch (error: any) {
            const is404ModelError = error?.status === 404 || 
                                    error?.statusCode === 404 || 
                                    error?.message?.includes("model_not_found") || 
                                    error?.message?.includes("does not exist") ||
                                    error?.message?.includes("decommissioned");

            if (is404ModelError) {
                const currentIndex = GROQ_FALLBACK_MODELS.indexOf(targetModel);
                const nextModel = currentIndex !== -1 && currentIndex + 1 < GROQ_FALLBACK_MODELS.length
                    ? GROQ_FALLBACK_MODELS[currentIndex + 1]
                    : undefined;
                if (nextModel && retryCount < maxRetries) {
                    console.warn(`Model '${targetModel}' not available. Falling back to '${nextModel}'...`);
                    return callAI(prompt, retryCount + 1, nextModel);
                }
            }

            if ((error?.status === 429 || error?.statusCode === 429) && retryCount < maxRetries) {
                const delay = Math.pow(2, retryCount) * 1000;
                console.log(`Groq rate limit hit (attempt ${retryCount + 1}), retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return callAI(prompt, retryCount + 1, targetModel);
            }

            console.warn(`Groq execution warning (${targetModel}): ${error?.message}. Attempting Gemini Flash fallback...`);
            // Fallback to Gemini if Groq fails
            if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "") {
                try {
                    return await callGemini(prompt);
                } catch (geminiError: any) {
                    console.error("Gemini fallback also failed:", geminiError?.message);
                }
            }

            throw new Error(`AI Processing failed: ${error?.message || "Unknown error"}`);
        }
    }

    // 2. Fallback to Gemini Flash if Groq API key is not set
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "") {
        return await callGemini(prompt);
    }

    throw new Error("No AI API key (GROQ_API_KEY or GEMINI_API_KEY) is available.");
}
