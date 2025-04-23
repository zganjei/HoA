import { answerQuery } from "@/services/llm";
import { parsePDF } from "@/services/pdf-parser";
import { retrieveRelevantChunks } from "@/services/vectorstore";
import { fillTemplate, associationInstructionsTemplate, loanInstructionsTemplate } from "@/services/prompt-engineering";

export async function summarizeReport(pdfBuffer: Buffer): Promise<any> {
    const chunks = await parsePDF(pdfBuffer);

    // --- Prompt Engineering for Association Details ---
    const associationPlaceholders = {
        association_name: "Brf Solsidan", // Example
        board_members: [
            { "name": "Anna Svensson", "role": "Ordförande" },
            { "name": "Erik Johansson", "role": "Kassör" }
        ], // Example placeholder
        association_summary: "Brf Solsidan är en...", // Example
    };
    const associationInstructions = fillTemplate(associationInstructionsTemplate, associationPlaceholders);
    const association_relevantChunks = await retrieveRelevantChunks(associationInstructions, chunks);
    const association_summary = await answerQuery(associationInstructions, association_relevantChunks);

    // --- Prompt Engineering for Loan Details ---
    const loanPlaceholders = {
        loan_details: [
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
        ] // Example
    };
    const loanInstructions = fillTemplate(loanInstructionsTemplate, loanPlaceholders);
    const loan_relevantChunks = await retrieveRelevantChunks(loanInstructions, chunks);
    const loan_summary = await answerQuery(loanInstructions, loan_relevantChunks);

    try {
        const association = typeof association_summary === "string" ? JSON.parse(association_summary) : association_summary;
        const loan = typeof loan_summary === "string" ? JSON.parse(loan_summary) : loan_summary;

        return {
            ...association,
            ...loan
        };
    } catch (err) {
        console.error("JSON Parse error in summarization service:", err);
        throw new Error("Failed to parse LLM response in summarization service.");
    }
}