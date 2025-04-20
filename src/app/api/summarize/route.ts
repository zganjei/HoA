import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";
import {summarizeText} from "@/lib/gpt";

export async function POST(req: NextRequest){
    const form_data = await req.formData();
    const file = form_data.get("file") as File;
    if (!file) {
        throw new Error("No file uploaded");
    }
    console.log("Received file:", file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdf(buffer);
    const summary = await summarizeText(parsed.text);
    return NextResponse.json({summary});

}