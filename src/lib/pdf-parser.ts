import pdf from 'pdf-parse';

export async function parsePDF(pdfBuffer : Buffer){
    const parsed = await pdf(pdfBuffer);
    const text = parsed.text;

    //split the text into smaller chunks
    const chunkSize = 1500;
    const chunks =[];

    for (let i =0; i< text.length; i+=chunkSize){
        chunks.push(text.slice(i, i+chunkSize));
    }
    return chunks;
}