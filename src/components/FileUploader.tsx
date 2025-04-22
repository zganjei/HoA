"use client";
import { useState } from "react";
import { FileUploaderProps} from "@/types/types";


const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange, onSubmit, loading }) => {
  const [localFile, setLocalFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setLocalFile(selectedFile);
    onFileChange(selectedFile);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
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
        disabled={!localFile || loading}
      >
        {loading ? "Summarizing..." : "Upload & Summarize"}
      </button>
    </form>
  );
};

export default FileUploader;