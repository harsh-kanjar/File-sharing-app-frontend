import React, { useEffect, useState } from "react";
import {
  FaFileAlt,
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileWord,
  FaDownload,
  FaFileCode,
} from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { RiUserShared2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";

const getFileIcon = (fileName) => {
  if (!fileName || typeof fileName !== "string")
    return <FaFileAlt className="text-gray-400 text-lg" />;

  const ext = fileName.split(".").pop().toLowerCase();

  switch (ext) {
    case "pdf":
      return <FaFilePdf className="text-red-500 text-lg" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FaFileImage className="text-blue-400 text-lg" />;
    case "mp4":
    case "mov":
    case "webm":
      return <FaFileVideo className="text-purple-400 text-lg" />;
    case "doc":
    case "docx":
      return <FaFileWord className="text-blue-600 text-lg" />;
    case "txt":
      return <FaFileAlt className="text-gray-400 text-lg" />;
    case "json":
      return <FaFileCode className="text-green-500 text-lg" />;
    default:
      return <FaFileAlt className="text-gray-400 text-lg" />;
  }
};

function Home() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingIds, setDeletingIds] = useState([]); // to track files being deleted

  useEffect(() => {
    const cachedFiles = sessionStorage.getItem("cachedFiles");
    if (cachedFiles) {
      setFiles(JSON.parse(cachedFiles));
      setLoading(false);
      return;
    }

    const fetchFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("t-shrf");
        if (!token) {
          navigate("/signup");
          return;
        }

        const res = await fetch("http://localhost:5000/files", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || `Server responded ${res.status}`);
        }

        const data = await res.json();
        const fileList = Array.isArray(data.files) ? data.files : [];
        setFiles(fileList);
        sessionStorage.setItem("cachedFiles", JSON.stringify(fileList));
      } catch (err) {
        console.error("Error fetching files:", err);
        setError(err.message || "Failed to fetch files");
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [navigate]);

  const renderDisplayName = (file) => {
    if (file.filename) return file.filename;

    if (file.link) {
      try {
        const last = file.link.split("/").pop().split("?")[0];
        return decodeURIComponent(last);
      } catch {
        return file.link;
      }
    }

    return "unknown";
  };

  const formatDate = (file) => {
    const raw = file.timeStamp || file.timestamp || file.createdAt;
    if (!raw) return "-";
    try {
      return new Date(raw).toLocaleString();
    } catch {
      return raw;
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    const token = localStorage.getItem("t-shrf");
    if (!token) {
      alert("You are not authenticated. Please login again.");
      navigate("/signup");
      return;
    }

    try {
      setDeletingIds((prev) => [...prev, fileId]);

      const res = await fetch(`http://localhost:5000/delete/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Delete failed with status ${res.status}`);
      }

      // Remove deleted file from state and sessionStorage
      setFiles((prev) => {
        const updated = prev.filter((file) => file._id !== fileId);
        sessionStorage.setItem("cachedFiles", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      alert("Failed to delete file: " + err.message);
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== fileId));
    }
  };

  return (
    <MainLayout>
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold">My Files</h1>
          <div className="text-sm text-gray-400">
            {files.length} file{files.length !== 1 ? "s" : ""}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading files...</p>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>
        ) : (
          <div className="overflow-x-auto max-h-[480px] overflow-y-auto rounded-xl shadow-lg border border-white/10 backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/0">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white/10 backdrop-blur-lg text-xs font-semibold uppercase text-gray-300 tracking-wider">
                <tr>
                  <th className="p-4">File</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Uploaded</th>
                  <th className="p-4 text-center">Download</th>
                  <th className="p-4 text-center">Shared</th>
                  <th className="p-4 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {files.length > 0 ? (
                  files.map((file, index) => {
                    const displayName = renderDisplayName(file);
                    const fileIcon = getFileIcon(file.filename || displayName);
                    const key = file._id || index;
                    const isDeleting = deletingIds.includes(key);

                    return (
                      <tr
                        key={key}
                        className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200 last:border-none"
                      >
                        <td className="p-4 flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-100">{fileIcon}</div>
                          <span
                            className="truncate max-w-[220px] font-medium text-gray-800"
                            title={displayName}
                          >
                            {displayName}
                          </span>
                        </td>

                        <td className="p-4 text-sm text-gray-600">
                          {file.size !== undefined && file.size !== null
                            ? `${file.size} KB`
                            : "-"}
                        </td>

                        <td className="p-4 text-sm text-gray-600">{formatDate(file)}</td>

                        <td className="p-4 text-center">
                          {file.link ? (
                            <a
                              href={file.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
                            >
                              <FaDownload />
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="p-4 text-center">
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
                            <RiUserShared2Fill />
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDelete(key)}
                            disabled={isDeleting}
                            title={isDeleting ? "Deleting..." : "Delete file"}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-60"
                          >
                            <AiFillDelete />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-6 text-center text-gray-500 italic"
                    >
                      No files found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Home;
