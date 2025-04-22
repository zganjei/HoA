"use client";
import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import SummaryDisplay from "@/components/SummaryDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SummaryData } from "@/types";

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

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🏘️ HoA Report Summarizer</h1>

        <FileUploader onFileChange={setFile} onSubmit={handleSubmit} loading={loading} />

        {loading && <LoadingSpinner />}

        {summary && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">📄 Extracted Information</h2>
            <SummaryDisplay summary={summary} />
          </div>
        )}
      </div>
    </main>
  );
}