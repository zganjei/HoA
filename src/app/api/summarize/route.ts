import { NextRequest, NextResponse } from "next/server";
import {answerQuery} from "@/lib/gpt";
import { parsePDF } from "@/lib/pdf-parser";
import { retrieveRelevantChunks } from "@/lib/vectorstore";

export async function POST(req: NextRequest){
    const form_data = await req.formData();
    const file = form_data.get("file") as File;
    if (!file) {
        throw new Error("No file uploaded");
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());

    //Parse the PDF and split it into chunks
    const chunks = await parsePDF(buffer);

    // Retrieve relevant chunks based on a user query
    const instructions = `You are an assistant helping to summarize an association's annual report which is in swedish or english.
                    Extract and summarize: 1. name of the association
                    2. board members with roles
                    3. all loans with bank names, amount, interest rate, and duration
                    provide a clear and concise summary for stakeholders`;
    
    const relevantChunks = await retrieveRelevantChunks(instructions, chunks);

    // Generate summary base on retrieved chunks
    const summary = await answerQuery(instructions, relevantChunks);

    return NextResponse.json({summary});

}