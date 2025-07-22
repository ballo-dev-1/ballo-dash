import { Pencil } from "lucide-react";
import React, { useState } from "react";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateLogoUrl, selectCompany } from "@/toolkit/Company/reducer";

type UploadPopupProps = {
  folder?: string; // optional folder path for S3
  onUploadComplete?: (fileUrl: string) => void; // callback with uploaded file URL
  id?: string;
};

const UploadPopup: React.FC<UploadPopupProps> = ({
  folder,
  onUploadComplete,
}) => {
  const dispatch = useDispatch();
  const company = useSelector(selectCompany);

  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => {
    setIsOpen(false);
    setFile(null);
    setUploading(false);
    setError(null);
    setSuccessUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        fileName: file.name,
        fileType: file.type,
        companyId: company?.id || "",
      });
      if (folder) {
        query.append("folder", folder);
      }

      // Get signed URL from backend
      const res = await fetch(`/api/upload-url?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to get upload URL");

      const { url, fileUrl } = await res.json();

      // Upload file to S3
      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");

      setSuccessUrl(fileUrl);
      onUploadComplete?.(fileUrl);
      dispatch(updateLogoUrl(fileUrl));
    } catch (err: any) {
      setError(err.message || "Upload error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <button onClick={openPopup} className="btn px-2" type="button">
        <Pencil color="white" />
      </button>

      {isOpen && (
        <div
          id="logo-upload-modal"
          className="modal-backdrop"
          onClick={closePopup}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Update company logo</h2>

            <input
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
              className="file-input"
            />

            {error && <p className="error-text">{error}</p>}

            {successUrl && (
              <p className="success-text">
                Upload successful! File URL:{" "}
                <a
                  href={successUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  View File
                </a>
              </p>
            )}

            <div className="button-group">
              <button
                onClick={closePopup}
                disabled={uploading}
                className="btn-secondary"
                type="button"
              >
                Cancel
              </button>

              <button
                onClick={uploadFile}
                disabled={uploading || !file}
                className="btn-primary"
                type="button"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadPopup;
