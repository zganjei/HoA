import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const llm = new ChatOpenAI({
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  timeout: 60000, // Adds a global timeout of 60 seconds (in milliseconds) for all calls with this LLM instance
});

export async function answerQuery(instructions: string, retrievedChunks: string[]): Promise<string | null> {
  // Combine retrieved chunks
  const context = retrievedChunks.join("\n");

  try {
    const response = await Promise.race([
      llm.invoke([
        new SystemMessage(instructions),
        new HumanMessage(context),
      ]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("API call timed out")), 45000) // Additional timeout of 45 seconds with Promise.race
      ),
    ]);

    // Return the extracted information
    return response.content;
  } catch (error: any) {
    console.error("Error calling the language model:", error);
    if (error?.name === 'TimeoutError') {
      return "The API call took too long to respond. Please try again later.";
    } else if (error instanceof Error) {
      return `An error occurred while calling the language model: ${error.message}`;
    } else {
      return "An unexpected error occurred while calling the language model.";
    }
  }
}