import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

function UploadFile() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    const token = localStorage.getItem("t-shrf");
    if (!token) {
      setStatus("No authentication token found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name); // automatically send file name

    try {
      setStatus("Uploading...");

      const res = await fetch("https://file-sharing-app-backend-mt69.onrender.com/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(`✅ Uploaded successfully! Link: ${data.uploadedFile}`);
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("❌ Failed to upload file.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Upload Your File
        </h2>

        {/* Upload Box */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition"
        >
          <FaCloudUploadAlt className="text-5xl text-blue-500 mb-3" />
          <p className="text-gray-500 mb-2">Drag & Drop your file here</p>
          <p className="text-gray-400 text-sm mb-3">or</p>

          <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition">
            Browse Files
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* File Preview */}
        {file && (
          <div className="mt-4 p-3 border rounded-lg bg-gray-50 text-gray-700">
            <strong>Selected File:</strong> {file.name}
          </div>
        )}

        {/* Upload Button */}
        {file && (
          <button
            onClick={handleUpload}
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Upload
          </button>
        )}

        {/* Status Message */}
        {status && (
          <div className="mt-4 text-center text-sm text-gray-700">{status}</div>
        )}
      </div>
    </div>
  );
}

export default UploadFile;
