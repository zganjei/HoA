import pdf from 'pdf-parse';

export async function parsePDF(pdfBuffer: Buffer) {
    const parsed = await pdf(pdfBuffer);
    const text = parsed.text;

    // Define chunk size and overlap
    const chunkSize = 1200;
    const overlap = 200;
    const chunks = [];

    // Loop through the text and create chunks with overlap
    for (let i = 0; i < text.length; i += chunkSize - overlap) {
        // Slice the text to create the chunk
        const chunk = text.slice(i, i + chunkSize);
        chunks.push(chunk);
    }

    return chunks;
}
