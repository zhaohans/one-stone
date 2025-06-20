import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useDocumentOperations,
  UploadDocumentData,
} from "@/hooks/useDocumentOperations";
import { Upload } from "lucide-react";
import { LoadingSpinner } from "./ui/loading-spinner";
import { useSuccessToast, useErrorToast } from "./ui/toast-manager";
import { ErrorBoundary } from "./ui/error-boundary";

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentUploaded: () => void;
  accountId?: string;
  clientId?: string;
  tradeId?: string;
}

const DocumentUploadModal = ({
  open,
  onOpenChange,
  onDocumentUploaded,
  accountId,
  clientId,
  tradeId,
}: DocumentUploadModalProps) => {
  const { uploadDocument } = useDocumentOperations();
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<UploadDocumentData>({
    title: "",
    description: "",
    document_type: "other",
    client_id: clientId,
    account_id: accountId,
    trade_id: tradeId,
    is_confidential: false,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const documentTypes = [
    { value: "kyc", label: "KYC Document" },
    { value: "account_opening", label: "Account Opening" },
    { value: "trade_confirmation", label: "Trade Confirmation" },
    { value: "statement", label: "Statement" },
    { value: "tax_document", label: "Tax Document" },
    { value: "compliance", label: "Compliance" },
    { value: "other", label: "Other" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!formData.title) {
        setFormData((prev) => ({ ...prev, title: selectedFile.name }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const result = await uploadDocument(file, formData);
      if (result.success) {
        successToast("Upload successful", "Document uploaded successfully.");
        onDocumentUploaded();
        onOpenChange(false);
        setFile(null);
        setFormData({
          title: "",
          description: "",
          document_type: "other",
          client_id: clientId,
          account_id: accountId,
          trade_id: tradeId,
          is_confidential: false,
        });
      } else {
        setError(result.error || "Upload failed");
        errorToast("Upload failed", result.error || "Upload failed");
      }
    } catch (err: any) {
      setError(err.message || "Upload failed");
      errorToast("Upload failed", err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <ErrorBoundary>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                required
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                disabled={isUploading}
              />
              {file && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                  MB)
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  disabled={isUploading}
                />
              </div>
              <div>
                <Label htmlFor="document_type">Document Type</Label>
                <Select
                  value={formData.document_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, document_type: value as any })
                  }
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional description..."
                rows={3}
                disabled={isUploading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_confidential"
                checked={formData.is_confidential}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    is_confidential: checked as boolean,
                  })
                }
                disabled={isUploading}
              />
              <Label htmlFor="is_confidential">Mark as confidential</Label>
            </div>
            {error && (
              <div className="text-red-600 font-medium text-center">
                {error}
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading || !file}>
                {isUploading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;
