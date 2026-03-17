import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, File, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";

type KnowledgeFile = {
  name: string;
  size: number;
  modified: string;
};

const KnowledgeBase = () => {
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      const data = await api.getKnowledgeFiles();
      setFiles(data.files);
    } catch (error) {
      toast.error("Failed to load knowledge base files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['txt', 'pdf', 'docx'].includes(ext || '')) {
      toast.error(`File type ${ext} not supported. Use .txt, .pdf, or .docx`);
      return;
    }

    setUploading(true);
    const toastId = toast.loading(`Uploading ${file.name}...`);
    
    try {
      const res = await api.uploadKnowledge(file);
      toast.success(`${file.name} uploaded successfully! Ingested ${res.chunks || 0} chunks.`, {
        id: toastId,
      });
      fetchFiles();
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`, { id: toastId });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      await api.deleteKnowledgeFile(filename);
      toast.success(`${filename} deleted successfully`);
      fetchFiles();
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Knowledge Base</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage documents that the AI uses to answer customer emails.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
              dragActive
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border/50 bg-card hover:border-primary/50 hover:bg-muted/30"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".txt,.pdf,.docx"
              onChange={handleChange}
            />
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Drag & Drop your document here
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Supported files: .txt, .pdf, .docx (Max 10MB)
            </p>
            <Button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[150px]"
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Uploading...
                </div>
              ) : (
                "Select File"
              )}
            </Button>
          </motion.div>

          {/* File List */}
          <div className="border border-border rounded-xl bg-card shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/20">
              <h3 className="text-sm font-semibold text-foreground">Uploaded Documents</h3>
            </div>
            {loading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Loading files...</div>
            ) : files.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No documents uploaded yet.</div>
            ) : (
              <div className="divide-y divide-border">
                {files.map((file, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={file.name}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{file.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(file.modified).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${file.name}?`)) {
                          handleDelete(file.name);
                        }
                      }}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="border border-border rounded-xl bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
              <File className="w-4 h-4 text-primary" />
              How it works
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground text-left">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs mt-0.5">1</div>
                <p>Upload your company's product manuals, FAQs, and policies.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs mt-0.5">2</div>
                <p>AISA automatically ingests and vectorizes the text.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs mt-0.5">3</div>
                <p>When an email arrives, AISA retrieves relevant context to craft an accurate reply.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
