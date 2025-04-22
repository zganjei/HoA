import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const llm = new ChatOpenAI({
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  timeout: 60000, // Global timeout of 60 seconds (in milliseconds)
});

// Simple in-memory cache
const aiCache = new Map<string, string>();

export async function answerQuery(instructions: string, retrievedChunks: string[]): Promise<string | null> {
  // Create a unique key based on the instructions and the context
  const cacheKey = `${instructions}-${retrievedChunks.join("||")}`;

  // Check if the answer is in the cache
  if (aiCache.has(cacheKey)) {
    console.log("Found answer in cache!");
    return aiCache.get(cacheKey) || null;
  }

  // Combine retrieved chunks
  const context = retrievedChunks.join("\n");

  try {
    const response = await llm.invoke([
      new SystemMessage(instructions),
      new HumanMessage(context),
    ]);

    // Save the answer to the cache before returning it
    if (response?.content) {
      aiCache.set(cacheKey, response.content.toString());
    }

    // Return the extracted information
    return response.content;
  } catch (error: unknown) {
    console.error("Error calling the language model:", error);
    if (error instanceof Error) {
      return `An error occurred while calling the language model: ${error.message}`;
    } else {
      return "An unexpected error occurred while calling the language model.";
    }
  }
}