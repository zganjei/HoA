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
    `Du är en expert på fastighetsrapportanalys som hjälper till att sammanfatta en bostadsrättsförenings årsredovisning. Sök noggrant efter information om Föreningens namn och Styrelsemedlemmar med roller.
  
    Ge ett strukturerat JSON-svar med följande format:
    {
      "föreningens_namn": "Brf Solsidan",
      "styrelsemedlemmar": [
        { "namn": "Anna Svensson", "roll": "Ordförande" },
        { "namn": "Erik Johansson", "roll": "Kassör" }
      ],
      "sammanfattning": "Brf Solsidan är en bostadsrättsförening. Styrelsen består bland annat av Anna Svensson som är Ordförande och Erik Johansson som är Kassör."
    }
  
    Om denna information är uppdelad över flera delar, se till att hämta alla nödvändiga detaljer från föregående och nästa delar för att slutföra extraktionen.
    Om informationen inte finns, ange "ej funnet" för varje nyckel.
  
    **Sammanfatta de grundläggande fakta om föreningen och dess styrelse baserat på den extraherade informationen. Inkludera föreningens namn och en kort översikt över styrelsens medlemmar och deras roller. Ge ett kort och koncist svar i sammanfattningen liknande exemplet ovan.**
  
    Extrahera all information och sammanfattningen i JSON-format.
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

  Ge ett strukturerat JSON-svar med följande format för information om alla lån och skulder som hittas:
  {
    "låneinformation": [
      {
        "banknamn": "Nordea",
        "lånebelopp": "1 800 000 tkr",
        "räntesats": "4.5%",
        "löptid": "5 år"
      },
      {
        "banknamn": "Swedbank",
        "lånebelopp": "750 000 tkr",
        "räntesats": "3.9%",
        "löptid": "10 år"
      }
      // ... och så vidare för alla lån som hittas
    ]
  }

  Om information om flera lån och skulder finns, inkludera dem alla som separata objekt i arrayen "låneinformation".
  Om informationen är uppdelad över flera delar, se till att hämta alla nödvändiga detaljer från föregående och nästa delar för att slutföra extraktionen för varje lån.
  Om ingen låneinformation finns, ska arrayen "låneinformation" vara tom: "låneinformation": [].
  Om specifik information för ett lån inte finns (t.ex. räntesats saknas för ett visst lån), ange "ej funnet" för den nyckeln inom det låneobjektet.

  Sammanfatta denna information och extrahera det i JSON-format.
  linda inte in i markdown eller lägg till någon text före eller efter.`;

    const loan_relevantChunks = await retrieveRelevantChunks(loan_instructions, chunks);
    const loan_summary = await answerQuery(loan_instructions, loan_relevantChunks);

    console.log(association_summary);
    console.log(loan_summary);
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
