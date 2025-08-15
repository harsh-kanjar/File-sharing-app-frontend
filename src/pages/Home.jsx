import React, { use, useEffect, useState } from "react";
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
import { MoreOptions } from "../components";

// -------- Get File Icon --------
 import {
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileAudio,
} from "react-icons/fa";

const getFileIcon = (fileName) => {
  if (!fileName || typeof fileName !== "string")
    return <FaFileAlt className="text-gray-400 text-lg" />;

  const ext = fileName.split(".").pop().toLowerCase();

  switch (ext) {
    // Documents
    case "pdf":
      return <FaFilePdf className="text-red-500 text-lg" />;
    case "doc":
    case "docx":
      return <FaFileWord className="text-blue-600 text-lg" />;
    case "xls":
    case "xlsx":
      return <FaFileExcel className="text-green-600 text-lg" />;
    case "ppt":
    case "pptx":
      return <FaFilePowerpoint className="text-orange-500 text-lg" />;
    case "txt":
      return <FaFileAlt className="text-gray-400 text-lg" />;

    // Code & Markup
    case "html":
    case "htm":
      return <FaFileCode className="text-orange-500 text-lg" />;
    case "css":
      return <FaFileCode className="text-blue-400 text-lg" />;
    case "js":
    case "jsx":
      return <FaFileCode className="text-yellow-400 text-lg" />;
    case "ts":
    case "tsx":
      return <FaFileCode className="text-blue-500 text-lg" />;
    case "json":
      return <FaFileCode className="text-green-500 text-lg" />;
    case "svg":
      return <FaFileImage className="text-pink-400 text-lg" />;

    // Images
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "webp":
      return <FaFileImage className="text-blue-400 text-lg" />;

    // Video
    case "mp4":
    case "mov":
    case "webm":
    case "avi":
    case "mkv":
      return <FaFileVideo className="text-purple-400 text-lg" />;

    // Audio
    case "mp3":
    case "wav":
    case "ogg":
    case "flac":
      return <FaFileAudio className="text-pink-500 text-lg" />;

    // Archives
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return <FaFileArchive className="text-yellow-600 text-lg" />;

    default:
      return <FaFileAlt className="text-gray-400 text-lg" />;
  }
};


function Home() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingIds, setDeletingIds] = useState([]);

  // Share modal states
  const [shareFileId, setShareFileId] = useState(null);
  const [shareFileName, setShareFileName] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState("");

  // file.link,file.fileName,file.size,file.timeStamp
  const [mFileLink, setMFileLink] = useState("");
  const [mFileName, setMFileName] = useState("");
  const [mFileSize, setMFileSize] = useState();
  const [mFileTimeStamp, setMFileTimeStamp] = useState();
  const [mUsername, setMUsername] = useState();
  const [openModal, setOpenModal] = useState(false)

  // -------- Fetch Files --------
  useEffect(() => {
    const cachedFiles = sessionStorage.getItem("cachedFiles");
    if (cachedFiles) {
      setFiles(JSON.parse(cachedFiles)); // show cached instantly
    }

    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("t-shrf");
        if (!token) {
          navigate("/signup");
          return;
        }

        const res = await fetch("https://file-sharing-app-backend-5xpl.onrender.com/files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        setError(err.message || "Failed to fetch files");
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
        return decodeURIComponent(file.link.split("/").pop().split("?")[0]);
      } catch {
        return file.link;
      }
    }
    return "unknown";
  };

  const formatDate = (file) => {
    const raw = file.timeStamp || file.timestamp || file.createdAt;
    return raw ? new Date(raw).toLocaleString() : "-";
  };

  // -------- Delete --------
  const handleDelete = async (fileId, fileLink) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    const token = localStorage.getItem("t-shrf");
    if (!token) {
      alert("Please login again.");
      navigate("/signup");
      return;
    }

    try {
      setDeletingIds((prev) => [...prev, fileId]);
      const res = await fetch(`https://file-sharing-app-backend-5xpl.onrender.com/delete/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ fileLink: fileLink })
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Delete failed with status ${res.status}`);
      }

      const updated = files.filter((file) => file._id !== fileId);
      setFiles(updated);
      sessionStorage.setItem("cachedFiles", JSON.stringify(updated));
    } catch (err) {
      alert("Failed to delete file: " + err.message);
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== fileId));
    }
  };

  // -------- Share --------
  // file.link,file.fileName,file.size,file.timeStamp
  const handleShareClick = (link, filename, size, timeStamp) => {
    setMFileLink(link);
    setMFileName(filename);
    setMFileSize(size);
    setMFileTimeStamp(timeStamp);
  };


  const handleShareSubmit = async () => {
    if (!mUsername) {
      setShareError("Please enter an email");
      return;
    }

    setShareLoading(true);
    setShareError("");

    try {
      const res = await fetch("https://file-sharing-app-backend-5xpl.onrender.com/share-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // username, link, filename, size, timeStamp
        body: JSON.stringify({
          username: mUsername,
          link: mFileLink,
          filename: mFileName,
          size: mFileSize,
          timeStamp: mFileTimeStamp
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to share file");

      alert("File shared successfully!");
      setShareFileId(null);
    } catch (err) {
      setShareError(err.message);
    } finally {
      setShareLoading(false);
    }
  };

  return (
    <MainLayout>
      <MoreOptions />

      <div className="px-6 pb-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold text-[#3C589D] bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 shadow-lg">
            My Files
          </h1>
          <div className="text-sm text-gray-200 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl px-3 py-1 inline-block shadow-sm">
            {files.length} file{files.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Loading / Error */}
        {loading ? (
          <p className="text-gray-400">Loading files...</p>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
        ) : (
          /* Table Container */
          <div className="overflow-x-auto rounded-2xl shadow-lg border border-white/20 backdrop-blur-md bg-white/30">
            <div className="max-h-[480px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white/30 backdrop-blur-md text-xs font-semibold uppercase text-gray-500 tracking-wider z-10">
                  <tr>
                    <th className="p-4">File</th>
                    <th className="p-4">Size</th>
                    <th className="p-4">Uploaded</th>
                    <th className="p-4 text-center">Download</th>
                    <th className="p-4 text-center">Share</th>
                    <th className="p-4 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {files.length > 0 ? (
                    files.map((file) => {
                      const displayName = renderDisplayName(file);
                      const fileIcon = getFileIcon(file.filename || displayName);
                      const isDeleting = deletingIds.includes(file._id);
                      return (
                        <tr key={file._id} className="hover:bg-white/20 border-b border-white/10 last:border-none">
                          <td className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-800">{fileIcon}</div>
                            <span className="truncate max-w-[220px] font-medium text-gray-800" title={displayName}>
                              {displayName}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-black">{file.size ? `${file.size} KB` : "-"}</td>
                          <td className="p-4 text-sm text-black">{formatDate(file)}</td>
                          <td className="p-4 text-center">
                            {file.link ? (
                              <a
                                href={file.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                              >
                                <FaDownload />
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => {
                                handleShareClick(file.link, file.filename, file.size, file.timeStamp);
                                setOpenModal(true);
                              }}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                            >
                              <RiUserShared2Fill />
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDelete(file._id, file.link)}
                              disabled={isDeleting}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-60"
                            >
                              <AiFillDelete />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-gray-500 italic">
                        No files found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {openModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 w-full max-w-md shadow-lg border border-white/20">
              <h2 className="text-lg font-semibold text-[#3C589D] mb-4">Share "{mFileName}"</h2>
              <input
                type="text"
                placeholder="Recipient's username"
                value={mUsername}
                onChange={(e) => setMUsername(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3C589D] outline-none mb-3 shadow-sm"
              />
              {shareError && <div className="text-red-500 text-sm mb-2">{shareError}</div>}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShareSubmit}
                  disabled={shareLoading}
                  className="px-4 py-2 bg-[#3C589D] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {shareLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>


  );
}

export default Home;
