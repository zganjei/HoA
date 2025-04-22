import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";


const llm = new ChatOpenAI({
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4",
});

export async function answerQuery(instructions:string, retrievedChunks: string[]){
     // Combine retrieved chunks
    const context = retrievedChunks.join("\n");

    const response = await llm.invoke([
        new SystemMessage(instructions),
        new HumanMessage(context)
    ]);

    // Return the extracted information
    return response.content;
}