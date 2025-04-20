"use client";
import {useState} from "react";
import Error from "next/error";

export default function UploadPage(){
    const [file, setFile] = useState<File | null>(null);
    const [summary, setSummary] = useState("");

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        if(!file) return;
        const formData = new FormData();
        formData.append("file",file);
        try{
            const res = await fetch("/api/summarize",{
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to summarize");
            const data = await res.json();  
            setSummary(data.summary);
        } catch (err) {
            setSummary("Error: " + err.message);
        } 
        // finally {
        //     setLoading(false);
        // }
    }

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-4">Upload HoA Report PDF</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="file" accept="application/pdf" onChange={
                    (e)=>{
                        const selectedFile = e.target.files?.[0];
                        setFile(selectedFile || null);
                        if (selectedFile) {
                            console.log("File name:", selectedFile.name);
                            console.log("File size:", selectedFile.size);
                            console.log("File type:", selectedFile.type);
                            // No full file path available due to browser restrictions
                        }
                    }
                }/>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Upload and Summarize
                </button>
            </form>
            <pre className="bg-gray-100 mt-6 p-4">{summary}</pre>
        </main>
    );
}