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
        `Du är en expert på fastighetsrapportanalys som hjälper till att sammanfatta en bostadsrättsförenings årsredovisning. Sök noggrant efter information om:

        - Föreningens namn
        - Styrelsemedlemmar med roller
        - Fastighetens adress och byggår (om det framgår tydligt)
        - Antal lägenheter och eventuellt lokaler
        - Typ av uppvärmning (t.ex. fjärrvärme, bergvärme)
        - Genomförda större renoveringar och planerade renoveringar (om det sammanfattas)
        - Föreningens ekonomi i stora drag (t.ex. skuldsättning per kvm, resultat)
        - Eventuella avgifter som ingår i månadsavgiften (t.ex. värme, vatten, bredband)

        Ge ett strukturerat JSON-svar med följande format:
        {
            "association": "Brf Solsidan",
            "members": [
            { "name": "Anna Svensson", "role": "Ordförande" },
            { "name": "Erik Johansson", "role": "Kassör" }
            ],
            "summary": "Brf Solsidan är en bostadsrättsförening belägen på [adress, om funnet], byggd [år, om funnet]. Föreningen består av [antal] lägenheter och [antal] lokaler. Uppvärmning sker via [typ av uppvärmning, om funnet]. Större renoveringar som genomförts inkluderar [lista, om sammanfattat]. Föreningens ekonomi kan beskrivas som [kort beskrivning, om sammanfattat]. I månadsavgiften ingår [lista över avgifter, om funnet]."
        }

        Om denna information är uppdelad över flera delar, se till att hämta alla nödvändiga detaljer från föregående och nästa delar för att slutföra extraktionen.
        Om informationen inte finns, ange "ej funnet" för varje nyckel i huvudobjektet (t.ex. "fastighetens_adress": "ej funnet") och inkludera inte den informationen i sammanfattningen.

        **Sammanfatta de viktigaste grundläggande fakta om föreningen och dess styrelse baserat på den extraherade informationen. Inkludera föreningens namn och en kort översikt över styrelsens medlemmar och deras roller. Försök även att inkludera information om fastighetens grundläggande karaktär (adress, byggår, antal lägenheter), uppvärmning, större renoveringar, ekonomi i stora drag och vad som ingår i månadsavgiften, om denna information tydligt framgår i rapporten. Var kortfattad och informativ i sammanfattningen liknande exemplet ovan.**

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
    "loan": [
      {
        "bank": "Nordea",
        "amount": "1 800 000 tkr",
        "interest": "4.5%",
        "term": "5 år"
      },
      {
        "bank": "Swedbank",
        "amount": "750 000 tkr",
        "interest": "3.9%",
        "term": "10 år"
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
