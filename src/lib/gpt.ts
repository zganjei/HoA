import {OpenAI} from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function summarizeText(text: string){
    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: `You are an assistant helping to summarize HomeOwners Association annual reports.
                Extract and summarize: 1. name of the association
                2. board members with roles
                3. all loans with bank names, amount, interest rate, and duration
                provide a clear and concise summary for stakeholders`
            },
            {
                role: "user",
                content: text
            }
        ]
    });

    return completion.choices[0].message.content;
}