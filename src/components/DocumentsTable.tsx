import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useSuccessToast, useErrorToast } from "./ui/toast-manager";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./ui/tooltip";
import { LoadingSpinner } from "./ui/loading-spinner";
import {
  Upload,
  FilePlus,
  Edit,
  Download,
  FolderOpen,
  History,
} from "lucide-react";
import { Progress } from "./ui/progress";

interface DocumentMeta {
  id: string;
  fileName: string;
  driveFileId: string;
  aiTags?: { tags?: string[] };
  uploadedAt?: string;
  size?: number;
  mimetype?: string;
  category?: string;
  complianceStatus?: string;
  docling?: any;
  [key: string]: any;
}

function getComplianceBadge(status?: string) {
  switch (status) {
    case "missing_tags":
      return (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
          Missing Tags
        </span>
      );
    case "missing_expiry":
      return (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
          Missing Expiry
        </span>
      );
    case "missing_status":
      return (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
          Missing Status
        </span>
      );
    case "expiring_soon":
      return (
        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
          Expiring Soon
        </span>
      );
    default:
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
          OK
        </span>
      );
  }
}

function getComplianceTooltip(status?: string) {
  switch (status) {
    case "missing_tags":
      return "This document is missing required tags.";
    case "missing_expiry":
      return "This document is missing an expiry date.";
    case "missing_status":
      return "This document is missing a status.";
    case "expiring_soon":
      return "This document is expiring within 7 days.";
    default:
      return "This document is compliant.";
  }
}

const DocumentsTable: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const statusOptions = ["Active", "Archived", "Pending"];
  const [allTags, setAllTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [moveIdx, setMoveIdx] = useState<number | null>(null);
  const [moveCategory, setMoveCategory] = useState("");
  const [moveFolderId, setMoveFolderId] = useState("");
  const [moveLoading, setMoveLoading] = useState(false);
  const [versionIdx, setVersionIdx] = useState<number | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [versionLoading, setVersionLoading] = useState(false);
  const [newVersionFile, setNewVersionFile] = useState<File | null>(null);
  const [uploadingVersion, setUploadingVersion] = useState(false);
  const [complianceFilter, setComplianceFilter] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState("");
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDriveLink, setUploadDriveLink] = useState("");
  const [analysisIdx, setAnalysisIdx] = useState<number | null>(null);

  const fetchDocs = async (
    q = "",
    tag = "",
    status = "",
    from = "",
    to = "",
    category = "",
    compliance = "",
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (tag) params.append("tag", tag);
      if (status) params.append("status", status);
      if (from) params.append("fromDate", from);
      if (to) params.append("toDate", to);
      if (category) params.append("category", category);
      if (compliance) params.append("compliance", compliance);
      const res = await fetch(`/documents/list?${params.toString()}`);
      if (!res.ok) {
        // Try to parse error from response, fallback to status text
        let errorText = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const data = await res.json();
          if (data && data.error) errorText = data.error;
        } catch {
          // Ignore JSON parse error, use status text
        }
        setError(errorText);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        let docs = data.documents;
        if (compliance === "needs_attention") {
          docs = docs.filter(
            (d: any) => d.complianceStatus && d.complianceStatus !== "ok",
          );
        }
        setDocuments(docs);
        // Collect all unique tags and categories for filter dropdowns/sidebar
        const tagsSet = new Set<string>();
        const categoriesSet = new Set<string>();
        docs.forEach((doc: any) => {
          (doc.aiTags?.tags || []).forEach((t: string) => tagsSet.add(t));
          if (doc.category) categoriesSet.add(doc.category);
        });
        setAllTags(Array.from(tagsSet));
        setAllCategories(Array.from(categoriesSet));
      } else {
        setError(data.error || "Failed to fetch documents");
      }
    } catch (err: any) {
      setError(err?.message || String(err) || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [retryCount]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    fetchDocs(
      e.target.value,
      tagFilter,
      statusFilter,
      fromDate,
      toDate,
      categoryFilter,
      complianceFilter,
    );
  };

  const handleTagFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTagFilter(e.target.value);
    fetchDocs(
      search,
      e.target.value,
      statusFilter,
      fromDate,
      toDate,
      categoryFilter,
      complianceFilter,
    );
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setStatusFilter(e.target.value);
    fetchDocs(
      search,
      tagFilter,
      e.target.value,
      fromDate,
      toDate,
      categoryFilter,
      complianceFilter,
    );
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
    fetchDocs(
      search,
      tagFilter,
      statusFilter,
      e.target.value,
      toDate,
      categoryFilter,
      complianceFilter,
    );
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
    fetchDocs(
      search,
      tagFilter,
      statusFilter,
      fromDate,
      e.target.value,
      categoryFilter,
      complianceFilter,
    );
  };

  const handleCategoryFilter = (cat: string) => {
    setCategoryFilter(cat);
    fetchDocs(
      search,
      tagFilter,
      statusFilter,
      fromDate,
      toDate,
      cat,
      complianceFilter,
    );
  };

  const handleComplianceFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setComplianceFilter(e.target.value);
    fetchDocs(
      search,
      tagFilter,
      statusFilter,
      fromDate,
      toDate,
      categoryFilter,
      e.target.value,
    );
  };

  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditTags(documents[idx].aiTags?.tags || []);
  };

  const handleTagChange = (i: number, value: string) => {
    setEditTags((tags) => tags.map((tag, idx) => (idx === i ? value : tag)));
  };

  const handleAddTag = () => {
    setEditTags((tags) => [...tags, ""]);
  };

  const handleRemoveTag = (i: number) => {
    setEditTags((tags) => tags.filter((_, idx) => idx !== i));
  };

  const handleSaveTags = async (doc: DocumentMeta, idx: number) => {
    try {
      const res = await fetch(`/documents/${doc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiTags: { tags: editTags } }),
      });
      const data = await res.json();
      if (data.success) {
        setDocuments((docs) =>
          docs.map((d, i) =>
            i === idx ? { ...d, aiTags: { tags: editTags } } : d,
          ),
        );
        setEditIdx(null);
      } else {
        errorToast("Error", data.error || "Failed to update tags");
      }
    } catch (err: any) {
      errorToast("Error", err.message || "Failed to update tags");
    }
  };

  const handleMove = (idx: number) => {
    setMoveIdx(idx);
    setMoveCategory(documents[idx].category || "");
    setMoveFolderId(documents[idx].driveFolderId || "");
    setTimeout(() => {
      const input = document.getElementById("move-folder-input");
      if (input) (input as HTMLInputElement).focus();
    }, 100);
  };

  const closeMoveModal = () => {
    setMoveIdx(null);
    setMoveCategory("");
    setMoveFolderId("");
    setMoveLoading(false);
  };

  const handleMoveConfirm = async () => {
    if (moveIdx === null) return;
    setMoveLoading(true);
    const doc = documents[moveIdx];
    let folderId = moveFolderId;
    try {
      if (moveCategory === "__new__" && moveFolderId) {
        const res = await fetch("/documents/create-folder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: moveFolderId }),
        });
        const data = await res.json();
        if (data.success) {
          folderId = data.folderId;
          successToast(
            "Folder created",
            `Folder "${moveFolderId}" created in Drive.`,
          );
        } else {
          errorToast("Error", data.error || "Failed to create folder");
          setMoveLoading(false);
          return;
        }
      }
      const res = await fetch(`/documents/move/${doc.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newCategory: moveCategory === "__new__" ? moveFolderId : moveCategory,
          newDriveFolderId: folderId,
          driveFileId: doc.driveFileId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        closeMoveModal();
        fetchDocs(
          search,
          tagFilter,
          statusFilter,
          fromDate,
          toDate,
          categoryFilter,
          complianceFilter,
        );
        successToast("Document moved", "Document moved successfully.");
      } else {
        errorToast("Error", data.error || "Failed to move document");
      }
    } catch (err: any) {
      errorToast("Error", err.message || "Failed to move document");
    } finally {
      setMoveLoading(false);
    }
  };

  const handleVersionHistory = async (idx: number) => {
    setVersionIdx(idx);
    setVersionLoading(true);
    try {
      const doc = documents[idx];
      const res = await fetch(`/documents/${doc.id}/versions`);
      const data = await res.json();
      if (data.success) {
        setVersions(data.versions);
      } else {
        errorToast("Error", data.error || "Failed to fetch versions");
      }
    } catch (err: any) {
      errorToast("Error", err.message || "Failed to fetch versions");
    } finally {
      setVersionLoading(false);
    }
  };

  const handleUploadVersion = async () => {
    if (versionIdx === null || !newVersionFile) return;
    setUploadingVersion(true);
    const doc = documents[versionIdx];
    try {
      const formData = new FormData();
      formData.append("file", newVersionFile);
      const res = await fetch(`/documents/${doc.id}/version`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        successToast("Version uploaded", "New version uploaded successfully.");
        handleVersionHistory(versionIdx); // Refresh versions
        setNewVersionFile(null);
      } else {
        errorToast("Error", data.error || "Failed to upload version");
      }
    } catch (err: any) {
      errorToast("Error", err.message || "Failed to upload version");
    } finally {
      setUploadingVersion(false);
    }
  };

  const closeVersionModal = () => {
    setVersionIdx(null);
    setVersions([]);
    setNewVersionFile(null);
    setUploadingVersion(false);
  };

  const handleRestoreVersion = async (version: any) => {
    if (versionIdx === null) return;
    const doc = documents[versionIdx];
    try {
      const res = await fetch(`/documents/${doc.id}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driveFileId: version.driveFileId,
          fileName: version.fileName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        successToast(
          "Version restored",
          "This version is now the current version.",
        );
        fetchDocs(
          search,
          tagFilter,
          statusFilter,
          fromDate,
          toDate,
          categoryFilter,
          complianceFilter,
        );
        handleVersionHistory(versionIdx); // Refresh versions
      } else {
        errorToast("Error", data.error || "Failed to restore version");
      }
    } catch (err: any) {
      errorToast("Error", err.message || "Failed to restore version");
    }
  };

  const extractDriveFileId = (link: string) => {
    const match = link.match(/\/d\/([\w-]+)/);
    return match ? match[1] : "";
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);
    try {
      let body;
      if (uploadDriveLink) {
        const driveFileId = extractDriveFileId(uploadDriveLink);
        body = JSON.stringify({
          driveFileId,
          driveLink: uploadDriveLink,
          category: uploadCategory,
          tags: uploadTags,
        });
      } else {
        if (!uploadFile) return;
        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("category", uploadCategory);
        formData.append("tags", JSON.stringify(uploadTags));
        body = formData;
      }
      const res = await fetch("/documents/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.success) {
        successToast("Upload complete", "Document metadata saved successfully.");
        setShowUploadModal(false);
        setRetryCount((c) => c + 1);
      } else {
        errorToast("Error", data.error || "Failed to save document metadata");
      }
    } catch (err: any) {
      errorToast("Error", err.message || "Failed to save document metadata");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <LoadingSpinner size="lg" text="Loading documents..." />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="text-red-600 font-semibold mb-2">{error}</div>
        <Button onClick={() => setRetryCount((c) => c + 1)} variant="outline">
          Retry
        </Button>
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {/* Upload Button */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Documents</h2>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload className="w-4 h-4" /> Upload Document
        </Button>
      </div>
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border-2 border-blue-200 p-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FilePlus className="w-5 h-5" /> Upload Document
            </h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">File *</label>
                <Input
                  type="file"
                  accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <Input
                  placeholder="e.g. Compliance, HR, Finance"
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tags (comma separated)
                </label>
                <Input
                  placeholder="e.g. policy, contract"
                  value={uploadTags.join(", ")}
                  onChange={(e) =>
                    setUploadTags(
                      e.target.value.split(",").map((t) => t.trim()),
                    )
                  }
                />
              </div>
              {uploading && (
                <div className="w-full my-2">
                  <Progress value={uploadProgress} />
                  <div className="text-xs text-gray-500 mt-1">
                    Uploading... {uploadProgress}%
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  disabled={uploading || !uploadFile}
                >
                  Upload
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-3 rounded-lg mb-2">
        <Input
          placeholder="Search by name or tag..."
          value={search}
          onChange={handleSearchChange}
          className="w-56"
        />
        <select
          value={tagFilter}
          onChange={handleTagFilterChange}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          value={complianceFilter}
          onChange={handleComplianceFilterChange}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">All Compliance</option>
          <option value="needs_attention">Needs Attention</option>
        </select>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">From</label>
          <Input
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            className="w-32"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">To</label>
          <Input
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            className="w-32"
          />
        </div>
      </div>
      <div className="flex">
        <aside className="w-48 mr-6">
          <div className="mb-4 font-semibold text-gray-700">Categories</div>
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left px-2 py-1 rounded ${categoryFilter === "" ? "bg-blue-100 font-bold" : "hover:bg-gray-100"}`}
                onClick={() => handleCategoryFilter("")}
              >
                All Categories
              </button>
            </li>
            {allCategories.map((cat) => (
              <li key={cat}>
                <button
                  className={`w-full text-left px-2 py-1 rounded ${categoryFilter === cat ? "bg-blue-100 font-bold" : "hover:bg-gray-100"}`}
                  onClick={() => handleCategoryFilter(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div className="flex-1">
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">File Name</th>
                  <th className="p-2 text-left">Tags</th>
                  <th className="p-2 text-left">Uploaded</th>
                  <th className="p-2 text-left">Size</th>
                  <th className="p-2 text-left">Compliance</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, idx) => (
                  <tr key={doc.id} className="border-b">
                    <td className="p-2">
                      <div className="flex flex-col">
                        <span className="font-semibold">{doc.fileName}</span>
                        <Button size="xs" variant="outline" className="mt-1 w-fit" onClick={() => setAnalysisIdx(idx)}>
                          View Analysis
                        </Button>
                      </div>
                    </td>
                    <td className="p-2">
                      {editIdx === idx ? (
                        <div className="flex flex-wrap gap-2">
                          {editTags.map((tag, i) => (
                            <span
                              key={i}
                              className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded"
                            >
                              <Input
                                className="w-20 text-xs"
                                value={tag}
                                onChange={(e) =>
                                  handleTagChange(i, e.target.value)
                                }
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveTag(i)}
                              >
                                ×
                              </Button>
                            </span>
                          ))}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleAddTag}
                          >
                            + Add
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {(doc.aiTags?.tags || []).map(
                            (tag: string, i: number) => (
                              <Badge
                                key={i}
                                className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs font-medium"
                              >
                                {tag}
                              </Badge>
                            ),
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      {doc.uploadedAt
                        ? new Date(doc.uploadedAt).toLocaleString()
                        : ""}
                    </td>
                    <td className="p-2">
                      {doc.size ? (doc.size / 1024).toFixed(1) + " KB" : ""}
                    </td>
                    <td className="p-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {getComplianceBadge(doc.complianceStatus)}
                          </TooltipTrigger>
                          <TooltipContent>
                            {getComplianceTooltip(doc.complianceStatus)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="p-2">
                      {editIdx === idx ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSaveTags(doc, idx)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditIdx(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(idx)}
                          >
                            Edit Tags
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMove(idx)}
                          >
                            Move
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleVersionHistory(idx)}
                          >
                            Version History
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Move Modal */}
          {moveIdx !== null && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-white p-6 rounded shadow-lg w-80">
                <h4 className="font-semibold mb-2">Move Document</h4>
                <div className="mb-2">
                  <label className="block text-xs mb-1">
                    Select Category/Folder
                  </label>
                  <select
                    value={moveCategory}
                    onChange={(e) => setMoveCategory(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    aria-label="Select category or folder"
                  >
                    <option value="">-- Select --</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__new__">+ New Category/Folder</option>
                  </select>
                  {moveCategory === "__new__" && (
                    <Input
                      id="move-folder-input"
                      className="mt-2"
                      placeholder="New category/folder name"
                      value={moveFolderId}
                      onChange={(e) => setMoveFolderId(e.target.value)}
                      aria-label="New category or folder name"
                    />
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={handleMoveConfirm}
                    disabled={moveLoading}
                    aria-label="Confirm move"
                  >
                    {moveLoading ? (
                      <span className="animate-spin mr-2">⏳</span>
                    ) : null}
                    {moveLoading ? "Moving..." : "Move"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={closeMoveModal}
                    aria-label="Cancel move"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
          {versionIdx !== null && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-white p-6 rounded shadow-lg w-[32rem] max-h-[90vh] overflow-y-auto">
                <h4 className="font-semibold mb-2">Version History</h4>
                {versionLoading ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    <table className="w-full text-xs mb-4">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 text-left">Version</th>
                          <th className="p-2 text-left">File Name</th>
                          <th className="p-2 text-left">Uploaded</th>
                          <th className="p-2 text-left">Uploader</th>
                          <th className="p-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {versions.map((v, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2">{v.version}</td>
                            <td className="p-2">{v.fileName}</td>
                            <td className="p-2">
                              {v.uploadedAt
                                ? new Date(v.uploadedAt).toLocaleString()
                                : ""}
                            </td>
                            <td className="p-2">{v.uploader || ""}</td>
                            <td className="p-2">
                              <a
                                href={`https://drive.google.com/uc?id=${v.driveFileId}&export=download`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button size="sm" variant="ghost">
                                  Download
                                </Button>
                              </a>
                              {i !== versions.length - 1 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRestoreVersion(v)}
                                >
                                  Restore
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4">
                      <label className="block text-xs mb-1">
                        Upload New Version
                      </label>
                      <Input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) =>
                          setNewVersionFile(e.target.files?.[0] || null)
                        }
                        disabled={uploadingVersion}
                      />
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={handleUploadVersion}
                        disabled={!newVersionFile || uploadingVersion}
                      >
                        {uploadingVersion ? "Uploading..." : "Upload Version"}
                      </Button>
                    </div>
                  </>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={closeVersionModal}
                    aria-label="Close version history"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {analysisIdx !== null && documents[analysisIdx] && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border-2 border-blue-200 p-8 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setAnalysisIdx(null)}>
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4">AI Document Analysis</h3>
            {documents[analysisIdx].docling ? (
              <div className="space-y-2">
                {documents[analysisIdx].docling.summary && (
                  <div><strong>Summary:</strong> {documents[analysisIdx].docling.summary}</div>
                )}
                {documents[analysisIdx].docling.text && (
                  <div><strong>Extracted Text:</strong><div className="max-h-40 overflow-y-auto bg-gray-50 p-2 rounded mt-1 text-xs">{documents[analysisIdx].docling.text}</div></div>
                )}
                {documents[analysisIdx].docling.tags && Array.isArray(documents[analysisIdx].docling.tags) && (
                  <div><strong>Tags:</strong> {documents[analysisIdx].docling.tags.join(", ")}</div>
                )}
                {/* Show raw JSON if no summary/text/tags */}
                {!documents[analysisIdx].docling.summary && !documents[analysisIdx].docling.text && !documents[analysisIdx].docling.tags && (
                  <pre className="whitespace-pre-wrap break-all bg-gray-100 p-2 rounded text-xs">{JSON.stringify(documents[analysisIdx].docling, null, 2)}</pre>
                )}
              </div>
            ) : (
              <div className="text-gray-500">No AI analysis available for this document.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsTable;
