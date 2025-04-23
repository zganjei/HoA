import { NextRequest, NextResponse } from "next/server";
import { summarizeReport } from "@/services/summarization";

export async function POST(req: NextRequest) {
    try {
        const form_data = await req.formData();
        const file = form_data.get("file") as File;
        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const summary = await summarizeReport(buffer);
        console.log(summary);
        return NextResponse.json(summary);

    } catch (err) {
        console.error("Error processing request:", err);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}