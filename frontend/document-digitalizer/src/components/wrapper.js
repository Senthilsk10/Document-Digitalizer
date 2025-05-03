import { useContext, useState } from "react";
import DocumentScanner from "./Uploader";
import AadharContext from "../AadharContext";

export default function DocumentScannerWrapper() {
  const { aadhar, setAadhar } = useContext(AadharContext);
  const [tempAadhar, setTempAadhar] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tempAadhar.trim()) {
      setAadhar(tempAadhar.trim());
    }
  };

  if (!aadhar) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-xl border max-w-md w-full"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Enter Your Aadhar</h2>
          <input
            type="text"
            placeholder="Enter Aadhar Number"
            value={tempAadhar}
            onChange={(e) => setTempAadhar(e.target.value)}
            className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Upload and Digitize Your Document
        </h1>
        <div className="p-4 bg-gray-50 rounded-xl">
          <DocumentScanner />
        </div>
        <div className="mt-6 bg-blue-50 rounded-lg p-4 text-blue-800 text-sm">
          <p className="font-medium mb-2">Tips for best results:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ensure good lighting when taking photos of documents</li>
            <li>Keep the document flat and avoid shadows</li>
            <li>Make sure all corners of the document are visible</li>
            <li>For multi-page documents, scan each page separately</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
