import { NextRequest, NextResponse } from "next/server";
import { answerQuery } from "@/lib/gpt";
import { parsePDF } from "@/lib/pdf-parser";
import { retrieveRelevantChunks } from "@/lib/vectorstore";

export async function POST(req: NextRequest) {
    const form_data = await req.formData();
    const file = form_data.get("file") as File;
    if (!file) {
    throw new Error("No file uploaded");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the PDF and split it into chunks
    const chunks = await parsePDF(buffer);

    const association_instructions = 
        `Du är en expert på fastighetsrapportanalys som hjälper till att sammanfatta en bostadsrättsförenings årsredovisning. Sök noggrant efter information om Föreningens namn, Styrelsemedlemmar med roller.
        Ge ett strukturerat JSON-svar med följande format:
        {
        "föreningens_namn": "Brf Solsidan",
        "styrelsemedlemmar": [
            { "namn": "Anna Svensson", "roll": "Ordförande" },
            { "namn": "Erik Johansson", "roll": "Kassör" }
        ],
        "sammanfattning": "Föreningen har en skuld till Nordea som beräknas uppgå till 1 800 000 tkr om fem år. Styrelsen har uppdaterat sin strategi för att minska skulden och förbättra föreningens ekonomi."
        }
        Om denna information är uppdelad över flera delar, se till att hämta alla nödvändiga detaljer från föregående och nästa delar för att slutföra extraktionen.
        Om informationen inte finns, ange "ej funnet" för varje nyckel.
        Sammanfatta denna information och extrahera det i JSON-format.
        linda inte in i markdown eller lägg till någon text före eller efter.`;

    const association_relevantChunks = await retrieveRelevantChunks(association_instructions, chunks);
    const association_summary = await answerQuery(association_instructions, association_relevantChunks);

    const loan_instructions = 
        `Du är en expert på fastighetsrapportanalys som hjälper till att sammanfatta en bostadsrättsförenings årsredovisning. Sök noggrant efter information om lån, skulder och finansiella detaljer.
        Låneinformation kan inkludera:
        - Banknamn (t.ex. "Nordea", "SEB", "Swedbank", etc.)
        - Lånebelopp
        - Räntesats
        - Löptid
        - Eventuellt finansiella tabeller
            Ge ett strukturerat JSON-svar med följande format för värje lån eller skuld.:
        "låneinformation": {
            "banknamn": "Nordea",
            "lånebelopp": "1 800 000 tkr",
            "räntesats": "4.5%",
            "löptid": "5 år"
        },
        "sammanfattning": "Föreningen har en skuld till Nordea som beräknas uppgå till 1 800 000 tkr om fem år. Styrelsen har uppdaterat sin strategi för att minska skulden och förbättra föreningens ekonomi."
        }
        Om denna information är uppdelad över flera delar, se till att hämta alla nödvändiga detaljer från föregående och nästa delar för att slutföra extraktionen.
        Om informationen inte finns, ange "ej funnet" för varje nyckel.
        Sammanfatta denna information och extrahera det i JSON-format.
        linda inte in i markdown eller lägg till någon text före eller efter.`;

    const loan_relevantChunks = await retrieveRelevantChunks(loan_instructions, chunks);
    const loan_summary = await answerQuery(loan_instructions, loan_relevantChunks);
    try {        
        const association = typeof association_summary === "string" ? JSON.parse(association_summary) : association_summary;
        const loan = typeof loan_summary === "string" ? JSON.parse(loan_summary) : loan_summary;

        const summary = {
        ...association,
        ...loan
        };
        return NextResponse.json(summary);
    } catch (err) {
        console.error("JSON Parse error", err);
        return NextResponse.json({ error: "Failed to parse response" }, { status: 500 });
    }
 }
