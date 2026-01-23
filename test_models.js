import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyDdcWMQCasxCOuNdXXHEQAEyVyhXEZJu58";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // Note: listModels is not directly available on the main client in some versions, 
        // but usually accessible via ModelService or we can try a basic generation on candidates.
        // Actually, the JS SDK v0.24.1 might not have a helper for ListModels easily exposed for the user to try 
        // without the ModelService. 
        // Let's just try to hit the API, or just try a list of known models.

        const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro", "gemini-1.5-pro"];

        for (const modelName of modelsToTry) {
            try {
                console.log(`Testing model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                await model.generateContent("Hello");
                console.log(`SUCCESS: ${modelName} works!`);
                process.exit(0);
            } catch (e) {
                console.log(`FAILED: ${modelName} - ${e.message.split('\n')[0]}`);
            }
        }
    } catch (error) {
        console.error("Fatal Error:", error);
    }
}

listModels();
