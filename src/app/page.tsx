"use client";
import { useState } from "react";

type Styrelsemedlem = {
  namn: string;
  roll: string;
};

type Låneinformation = {
  banknamn: string;
  lånebelopp: string;
  räntesats: string;
  löptid: string;
};

type SummaryData = {
  föreningens_namn: string;
  styrelsemedlemmar: Styrelsemedlem[];
  sammanfattning: string;
  låneinformation: Låneinformation;
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<SummaryData | string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setSummary(null);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed with status ${res.status}: ${errorText}`);
      }
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      if (err instanceof Error) {
        setSummary("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const renderJson = (json: SummaryData) => {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-bold">Föreningens Namn:</h3>
          <p>{json.föreningens_namn}</p>
        </div>

        <div>
          <h3 className="font-bold">Styrelsemedlemmar:</h3>
          <ul>
            {json.styrelsemedlemmar?.length ? (
              json.styrelsemedlemmar.map((member, index) => (
                <li key={index}>
                  <strong>{member.namn}</strong> - {member.roll}
                </li>
              ))
            ) : (
              <p>Ej funnet</p>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-bold">Sammanfattning:</h3>
          <p>{json.sammanfattning || "Ej funnet"}</p>
        </div>

        <div>
          <h3 className="font-bold">Låneinformation:</h3>
          {json.låneinformation ? (
            <div>
              <p><strong>Banknamn:</strong> {json.låneinformation.banknamn}</p>
              <p><strong>Lånebelopp:</strong> {json.låneinformation.lånebelopp}</p>
              <p><strong>Räntesats:</strong> {json.låneinformation.räntesats}</p>
              <p><strong>Löptid:</strong> {json.låneinformation.löptid}</p>
            </div>
          ) : (
            <p>Ej funnet</p>
          )}
        </div>
      </div>
    );
  };

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
            {typeof summary === "string" ? (
              <p>{summary}</p>
            ) : (
              renderJson(summary)
            )}
          </div>
        )}
      </div>
    </main>
  );
}
