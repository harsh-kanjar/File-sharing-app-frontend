import React, { useState } from "react";
import { FaCloudUploadAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function UploadFile() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0] || null);
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
    formData.append("filename", file.name);

    try {
      setStatus("Uploading...");

      const res = await fetch("https://file-sharing-app-backend-5xpl.onrender.com/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setStatus(
        res.ok
          ? `✅ Uploaded successfully! Link: ${data.uploadedFile}`
          : `❌ Error: ${data.error}`
      );
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("❌ Failed to upload file.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#EAF0FF]/80 to-[#FDFEFF]/80"
      style={{
        backgroundImage: "url('/bg/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-lg p-8 bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 relative">
        
        {/* Home/Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-5 left-5 text-white hover:text-blue-200 transition"
        >
          <FaArrowLeft className="text-xl drop-shadow-lg" />
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-white mb-6 text-center drop-shadow-lg">
          Upload Your File
        </h2>

        {/* Upload Box */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-white/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition duration-300 hover:border-blue-400 hover:shadow-lg hover:bg-white/20"
        >
          <FaCloudUploadAlt className="text-6xl text-white mb-4 drop-shadow-lg" />
          <p className="text-white/90 mb-1 font-medium">
            Drag & Drop your file here
          </p>
          <p className="text-white/60 text-sm mb-4">or</p>

          <label className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-xl cursor-pointer font-medium hover:opacity-90 transition">
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
          <div className="mt-5 p-4 border rounded-2xl bg-white/30 text-white shadow-md backdrop-blur-sm">
            <strong>Selected File:</strong> {file.name}
          </div>
        )}

        {/* Upload Button */}
        {file && (
          <button
            onClick={handleUpload}
            className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Upload
          </button>
        )}

        {/* Status Message */}
        {status && (
          <div className="mt-4 text-center text-sm text-white/80">{status}</div>
        )}
      </div>
    </div>
  );
}
