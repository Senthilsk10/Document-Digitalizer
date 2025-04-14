import React, { useState, useRef } from "react";
import { Upload, Check, X, Plus, BookOpen } from "lucide-react";

// Simple UUID generator function
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const DocumentUploader = () => {
  const [pages, setPages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [isMultiPage, setIsMultiPage] = useState(false);

  const fileInputRef = useRef(null);

  // Document session ID
  const documentId = useRef(generateUUID());

  const handleFileUpload = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const newPages = Array.from(files).map((file, index) => {
        const pageId = generateUUID();
        return {
          id: pageId,
          documentId: documentId.current,
          file: file,
          preview: URL.createObjectURL(file),
          timestamp: new Date().toISOString(),
          name: file.name,
          pageNumber: pages.length + index + 1,
        };
      });

      setPages((prevPages) => [...prevPages, ...newPages]);

      // If this is the first page(s), set multi-page flag automatically based on file count
      if (pages.length === 0) {
        setIsMultiPage(files.length > 1);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePage = (id) => {
    setPages((prevPages) => {
      const filteredPages = prevPages.filter((page) => page.id !== id);

      // Renumber pages
      return filteredPages.map((page, index) => ({
        ...page,
        pageNumber: index + 1,
      }));
    });
  };

  const uploadDocument = async () => {
    if (pages.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Add document metadata
      formData.append("documentId", documentId.current);
      formData.append(
        "documentName",
        documentName || `Document-${new Date().toISOString()}`
      );
      formData.append("pageCount", pages.length.toString());
      formData.append("isMultiPage", isMultiPage.toString());

      // Add all pages to form data
      pages.forEach((page) => {
        formData.append("pages", page.file, `page-${page.pageNumber}.jpg`);

        // Also add metadata for each page
        formData.append(
          "pageMetadata",
          JSON.stringify({
            pageId: page.id,
            pageNumber: page.pageNumber,
            timestamp: page.timestamp,
          })
        );
      });

      // Send to backend API
      const response = await fetch(
        "https://ubiquitous-spork-9pwjjqv9jjj3x67x-5000.app.github.dev/api/upload-document",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload success:", result);

      setUploadComplete(true);

      // If single page document, clean up immediately
      if (!isMultiPage) {
        setTimeout(() => {
          resetAfterUpload();
        }, 2000);
      }
    } catch (err) {
      setError("Upload error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetAfterUpload = () => {
    setUploadComplete(false);
    setPages([]);
    setDocumentName("");
    setIsMultiPage(false);
    // Generate new document ID for next document
    documentId.current = generateUUID();
  };

  const startNewDocument = () => {
    // Confirm if there are unsaved pages
    if (pages.length > 0 && !uploadComplete) {
      if (
        window.confirm("You have unsaved pages. Start a new document anyway?")
      ) {
        resetAfterUpload();
      }
    } else {
      resetAfterUpload();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 bg-gray-50 rounded-lg shadow">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Document Upload</h2>
        <button
          onClick={startNewDocument}
          className="text-sm px-2 py-1 bg-gray-200 text-gray-700 rounded flex items-center"
        >
          <Plus size={16} className="mr-1" /> New Doc
        </button>
      </div>

      {error && (
        <div className="w-full p-3 mb-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {uploadComplete && (
        <div className="w-full p-3 mb-4 bg-green-100 text-green-700 rounded flex items-center">
          <Check className="mr-2" size={18} />
          Document uploaded successfully!
        </div>
      )}

      <div className="w-full mb-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={20} />
          <input
            type="text"
            placeholder="Document Name (optional)"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
        </div>

        {pages.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isMultiPage}
                onChange={(e) => setIsMultiPage(e.target.checked)}
                className="mr-2"
              />
              Multi-page document
            </label>
          </div>
        )}
      </div>

      <div className="w-full flex justify-center mb-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg flex items-center"
        >
          <Upload className="mr-2" size={20} />
          Upload Pages
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          multiple
          capture="environment"
          className="hidden"
        />
      </div>

      {pages.length > 0 && (
        <>
          <div className="w-full">
            <h3 className="font-bold mb-2">Document Pages ({pages.length})</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {pages.map((page) => (
                <div key={page.id} className="relative">
                  <img
                    src={page.preview}
                    alt={`Page ${page.pageNumber}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">
                    {page.pageNumber}
                  </div>
                  <button
                    onClick={() => removePage(page.id)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={uploadDocument}
            disabled={isUploading}
            className={`w-full py-2 ${
              isUploading ? "bg-blue-300" : "bg-blue-600"
            } text-white rounded-lg flex items-center justify-center`}
          >
            {isUploading ? "Uploading..." : "Upload Document"}
          </button>
        </>
      )}

      <div className="mt-4 text-xs text-gray-500">
        Document ID: {documentId.current}
      </div>
    </div>
  );
};

export default DocumentUploader;
