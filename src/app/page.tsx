"use client";
import {useState} from "react";

export default function UploadPage(){
    const [file, setFile] = useState<File | null>(null);
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        if(!file) return;

        const formData = new FormData();
        formData.append("file",file);

        setLoading(true);
        setSummary("Loading...");

        try{
            const res = await fetch("/api/summarize",{
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed with status ${res.status}: ${errorText}`);
            }
            const data = await res.json();  
            console.log("received...................");
            console.log(data)
            setSummary(JSON.stringify(data, null, 2));
        } catch (err) {
            if (err instanceof Error) {
                setSummary("Error: " + err.message);
            }        
        } 
        finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🏘️ HoA Report Summarizer</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
            disabled={!file || loading}
          >
            {loading ? "Summarizing..." : "Upload & Summarize"}
          </button>
        </form>

        {loading && (
          <div className="flex justify-center mt-6">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        )}

        {summary && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">📄 Summary</h2>
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-[400px] overflow-auto text-sm">
            {summary}
            </pre>
          </div>
        )}
      </div>
    </main>
    );
}