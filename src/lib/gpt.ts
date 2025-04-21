import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";


const llm = new ChatOpenAI({
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
});

export async function answerQuery(instructions:string, retrievedChunks: string[]){
    const context = retrievedChunks.join("\n"); // Combine retrieved chunks


    const response = await llm.call([
        new SystemMessage(instructions),
        new HumanMessage(context)
    ]);

    // Return the summary
    return response.content;
}