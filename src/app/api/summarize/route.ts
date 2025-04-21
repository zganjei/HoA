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
    const instructions = `Du är en assistent som hjälper till att sammanfatta en bostadsrättsförenings årsredovisning, som kan vara på svenska eller engelska.
                            Extrahera och sammanfatta följande:
                            Föreningens namn
                            Styrelsemedlemmar med roller
                            Alla lån, inklusive bankernas namn, lånebelopp, räntesats och löptid
                            Ge en tydlig och koncis sammanfattning för intressenter.`;
    
    const relevantChunks = await retrieveRelevantChunks(instructions, chunks);

    // Generate summary base on retrieved chunks
    const summary = await answerQuery(instructions, relevantChunks);

    return NextResponse.json({summary});

}