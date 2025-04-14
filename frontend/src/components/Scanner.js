import React, { useState, useRef } from "react";
import { Camera, Upload, Check, X, Plus, BookOpen } from "lucide-react";

// Simple UUID generator function
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const DocumentScanner = () => {
  const [pages, setPages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [isMultiPage, setIsMultiPage] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Document session ID
  const documentId = useRef(generateUUID());

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use rear camera
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError("Camera access error: " + err.message);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
      setCameraActive(false);
    }
  };

  const capturePage = () => {
    if (videoRef.current && cameraActive) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0);

      // Convert to blob to simulate file object
      canvas.toBlob((blob) => {
        const pageId = generateUUID();
        const newPage = {
          id: pageId,
          documentId: documentId.current,
          file: blob,
          preview: canvas.toDataURL("image/jpeg"),
          timestamp: new Date().toISOString(),
          source: "camera",
          pageNumber: pages.length + 1,
        };

        setPages((prevPages) => [...prevPages, newPage]);

        // If this is the first page, ask if there are more pages
        if (pages.length === 0) {
          setIsMultiPage(false); // Default to single page document
        }
      }, "image/jpeg");
    }
  };

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
          source: "upload",
          name: file.name,
          pageNumber: pages.length + index + 1,
        };
      });

      setPages((prevPages) => [...prevPages, ...newPages]);

      // If this is the first page(s), ask if there are more pages
      if (pages.length === 0) {
        setIsMultiPage(files.length > 1); // Default to multi-page if multiple files uploaded
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
            source: page.source,
          })
        );
      });
      console.log(formData);
      // Send to backend API
      const response = await fetch(
        "https://zxkk943x-5000.inc1.devtunnels.ms/api/upload-document",
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
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-2">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Document Scanner</h2>
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

      {cameraActive ? (
        <div className="w-full relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg mb-4"
          ></video>

          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={capturePage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
            >
              <Camera className="mr-2" size={18} />
              Capture Page
            </button>

            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center"
            >
              <X className="mr-2" size={18} />
              Close Camera
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center gap-4 mb-4">
          {/* <button */}
          {/* onClick={startCamera} */}
          {/* className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center" */}
          {/* > */}
          {/* <Camera className="mr-2" size={18} /> */}
          {/* Scan Page */}
          {/* </button> */}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center"
          >
            <Upload className="mr-2" size={18} />
            Upload Pages
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>
      )}

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

export default DocumentScanner;
