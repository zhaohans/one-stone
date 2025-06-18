import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface UploadResult {
  success: boolean;
  fileId?: string;
  aiTags?: any;
  error?: string;
}

const DocumentUpload: React.FC<{ onUploadSuccess?: () => void }> = ({ onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setShowReview(false);
      setAiTags([]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setAiTags([]);
    setShowReview(false);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/documents/upload', {
        method: 'POST',
        body: formData,
      });
      const data: UploadResult = await res.json();
      if (data.success) {
        setAiTags(data.aiTags?.tags || []);
        setShowReview(true);
        if (onUploadSuccess) onUploadSuccess();
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleTagEdit = (index: number, newTag: string) => {
    setAiTags(tags => tags.map((tag, i) => (i === index ? newTag : tag)));
  };

  const handleAddTag = () => {
    setAiTags(tags => [...tags, '']);
  };

  const handleRemoveTag = (index: number) => {
    setAiTags(tags => tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx" />
        <Button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {showReview && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-semibold mb-2">AI-Suggested Tags (edit before saving):</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {aiTags.map((tag, idx) => (
              <span key={idx} className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
                <Input
                  className="w-24 text-xs"
                  value={tag}
                  onChange={e => handleTagEdit(idx, e.target.value)}
                />
                <Button size="sm" variant="ghost" onClick={() => handleRemoveTag(idx)}>
                  ×
                </Button>
              </span>
            ))}
            <Button size="sm" variant="outline" onClick={handleAddTag}>+ Add Tag</Button>
          </div>
          <div className="text-xs text-gray-500">Review and edit tags before finalizing.</div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload; 