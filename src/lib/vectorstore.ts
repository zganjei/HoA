import { OpenAIEmbeddings } from "@langchain/openai";
import {MemoryVectorStore} from "langchain/vectorstores/memory";

const embeddings = new OpenAIEmbeddings();

export async function retrieveRelevantChunks(query: string, chunks : string[]){
    const vectorStore = await MemoryVectorStore.fromTexts(chunks, [], embeddings);
    if(!vectorStore) throw new Error("Vector store not initialized");

    const k = 5; //Number of similar chunks to retrieve
    const results = await vectorStore.similaritySearch(query, k);
    
    return results.map(res => res.pageContent); // return the indexes of the retrieved chunks
}