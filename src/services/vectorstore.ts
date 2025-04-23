import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";

const embeddings = new OpenAIEmbeddings();
let vectorStore: MemoryVectorStore | null = null;

async function getOrCreateVectorStore(chunks: string[]): Promise<MemoryVectorStore> {
  if (!vectorStore) {
    vectorStore = await MemoryVectorStore.fromTexts(chunks, [], embeddings);
    if (!vectorStore) {
      throw new Error("Failed to initialize vector store.");
    }
  } else {
    const newDocuments = chunks.map(chunk => new Document({ pageContent: chunk }));
    await vectorStore.addDocuments(newDocuments);
  }
  return vectorStore;
}

export async function retrieveRelevantChunks(query: string, chunks: string[]): Promise<string[]> {
  const store = await getOrCreateVectorStore(chunks);
  const k = 5;
  const results = await store.similaritySearch(query, k);
  return results.map((res) => res.pageContent);
}