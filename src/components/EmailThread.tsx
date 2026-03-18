import { useState } from "react";
import { X, Reply, Zap, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface EmailThreadProps {
  email: {
    id: string;
    from: string;
    fromEmail: string;
    subject: string;
    status: string;
    summary?: string;
    suggestedReply?: string;
    thread: { from: string; body: string; time: string; isAuto?: boolean }[];
  };
  onClose: () => void;
}

const EmailThread = ({ email, onClose }: EmailThreadProps) => {
  const isReplied = email.status?.toLowerCase() === "replied";
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await api.sendReply(Number(email.id), replyText);
      toast.success("Reply sent successfully");
      setShowReply(false);
    } catch (error: any) {
      toast.error(`Failed to send reply: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="gradient-card border border-border rounded-xl shadow-card overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">
            {email.subject}
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          {email.from} ·{" "}
          <span className="font-mono text-xs">{email.fromEmail}</span>
        </p>

        {email.summary && (
          <div className="mt-3">
            <h3 className="text-xs font-semibold uppercase text-primary mb-1">
              Brief summary
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              {email.summary}
            </p>
          </div>
        )}
      </div>

      {/* Thread Messages */}
      <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
        {email.thread.map((msg, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg ${
              msg.isAuto
                ? "bg-primary/5 border border-primary/15"
                : "bg-secondary"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {msg.isAuto && (
                <Zap className="w-3.5 h-3.5 text-primary" />
              )}

              <span
                className={`text-sm font-medium ${
                  msg.isAuto ? "text-primary" : "text-foreground"
                }`}
              >
                {msg.from}
              </span>

              <span className="text-xs text-muted-foreground ml-auto">
                {msg.time}
              </span>
            </div>

            <div
              className={`text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap [&>b]:text-foreground [&>b]:font-semibold [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5`}
              dangerouslySetInnerHTML={{ __html: msg.body.replace(/\n/g, '<br/>') }}
            />
          </div>
        ))}
      </div>

      {/* AI suggested reply - Only show if we haven't replied yet */}
      {email.suggestedReply && !isReplied && (
        <div className="p-5 border-t border-border bg-secondary/50">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-semibold uppercase text-primary">
              AI suggested reply
            </h3>
            <Button
              size="sm"
              variant="outline"
              className="border-border text-muted-foreground"
              onClick={() => {
                setReplyText(email.suggestedReply || "");
                setShowReply(true);
              }}
            >
              Edit
            </Button>
          </div>

          <div
            className="text-sm text-foreground whitespace-pre-wrap leading-relaxed [&>b]:font-semibold [&>br]:block"
            dangerouslySetInnerHTML={{ __html: email.suggestedReply || "" }}
          />
        </div>
      )}

      {/* Reply Section - Hide if already replied (unless user intentionally wants to reply again, but for now we follow the 'duplicated' report) */}
      {!isReplied && (
        <div className="p-5 border-t border-border">
          {showReply ? (
            <div className="space-y-3">

              {/* Reply textarea */}
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none"
              />

              {/* Show attached file */}
              {attachment && (
                <p className="text-xs text-muted-foreground">
                  Attached: {attachment.name}
                </p>
              )}

              {/* Hidden file input */}
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Buttons */}
              <div className="flex gap-2 justify-end items-center">

                {/* Attach File */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("fileUpload")?.click()
                  }
                  className="border-border text-muted-foreground"
                >
                  <Paperclip className="w-3.5 h-3.5 mr-1.5" />
                  Attach File
                </Button>

                {/* Cancel */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReply(false)}
                  className="border-border text-muted-foreground"
                >
                  Cancel
                </Button>

                {/* Send */}
                <Button
                  size="sm"
                  onClick={handleSend}
                  disabled={sending}
                  className="gradient-primary text-primary-foreground shadow-glow"
                >
                  {sending ? (
                    <div className="w-3.5 h-3.5 mr-1.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Send
                </Button>

              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                if (email.suggestedReply) setReplyText(email.suggestedReply);
                setShowReply(true);
              }}
              className="border-border text-foreground hover:bg-secondary"
            >
              <Reply className="w-4 h-4 mr-2" />
              Reply
            </Button>
          )}
        </div>
      )}
      
      {isReplied && (
        <div className="p-5 border-t border-border text-center">
           <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
             <Zap className="w-4 h-4 text-primary" />
             This email has already been addressed by FirstBank AI.
           </p>
        </div>
      )}
    </div>
  );
};

export default EmailThread;