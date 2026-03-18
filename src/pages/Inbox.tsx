import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, RefreshCw, Circle, Paperclip, Clock, ChevronRight, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import EmailThread from "@/components/EmailThread";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  hasAttachment: boolean;
  autoReplied: boolean;
  status: string;
  summary?: string;                   // short brief summary like screenshot
  suggestedReply?: string;            // AI suggested reply text
  thread: { from: string; body: string; time: string; isAuto?: boolean }[];
}

const mockEmails: Email[] = [
  {
    id: "1",
    from: "Tunde Bakare",
    fromEmail: "tunde.b@example.com",
    subject: "Inquiry on FirstGem Account",
    preview: "Good morning, I would like to know the requirements for opening a FirstGem account...",
    time: "2m ago",
    unread: true,
    hasAttachment: false,
    autoReplied: true,
    status: "replied",
    summary: "Customer is asking about the requirements to open a FirstGem account.",
    suggestedReply: "Dear Tunde,<br><br>Thank you for reaching out regarding the FirstGem account.<br><br>The FirstGem account is designed to empower women to achieve their financial goals. To open a FirstGem account, you will need the following:<br>1. A completed account opening form.<br>2. Two recent passport photographs.<br>3. A valid means of identification (National ID, Driver's License, or International Passport).<br>4. A utility bill issued within the last 3 months.<br><br>You can initiate the account opening process via our FirstMobile App or visit any First Bank branch nearest to you.<br><br>Kind regards,<br><b>AISA — First Bank Virtual Assistant</b>",
    thread: [
      { from: "Tunde Bakare", body: "Good morning,\n\nI would like to know the requirements for opening a FirstGem account for my wife. What documents do we need to bring to the branch?\n\nRegards,\nTunde", time: "2m ago" },
      { from: "FirstBank AI", body: "Dear Tunde,<br><br>Thank you for reaching out regarding the FirstGem account.<br><br>The FirstGem account is designed to empower women to achieve their financial goals. To open a FirstGem account, you will need the following:<br>1. A completed account opening form.<br>2. Two recent passport photographs.<br>3. A valid means of identification (National ID, Driver's License, or International Passport).<br>4. A utility bill issued within the last 3 months.<br><br>You can initiate the account opening process via our FirstMobile App or visit any First Bank branch nearest to you.<br><br>Kind regards,<br><b>AISA — First Bank Virtual Assistant</b>", time: "1m ago", isAuto: true }
    ],
  },
  {
    id: "2",
    from: "Ngozi Obi",
    fromEmail: "ngozi.obi12@gmail.com",
    subject: "Card Dispense Error at ATM",
    preview: "Hello, I tried to withdraw N20,000 from the ATM but it did not dispense...",
    time: "18m ago",
    unread: true,
    hasAttachment: false,
    autoReplied: false,
    status: "pending_review",
    summary: "Customer was debited N20,000 but the ATM did not dispense cash.",
    suggestedReply: "Dear Ngozi,<br><br>Could you please provide more details regarding this specific transaction? I would be happy to look into this specifically for you and ensure you receive the most accurate assistance.<br><br>Kindly provide the <b>Transaction Reference Number</b> and the <b>Value Date</b> of the transaction so we can investigate this missing funds issue.<br><br>Kind regards,<br><b>AISA — First Bank Virtual Assistant</b>",
    thread: [
      { from: "Ngozi Obi", body: "Hello,\n\nI tried to withdraw N20,000 from the ATM in Lekki but it did not dispense the cash, yet my account has been debited. Please reverse my money. This is urgent.", time: "18m ago" },
    ],
  },
  {
    id: "3",
    from: "Adeyemi Tech Solutions",
    fromEmail: "billing@adeyemitech.com.ng",
    subject: "Corporate Account Maintenance Fee",
    preview: "We noticed a deduction for account maintenance fee that seems higher than usual...",
    time: "1h ago",
    unread: false,
    hasAttachment: true,
    autoReplied: true,
    status: "replied",
    summary: "Corporate client querying account maintenance fee deductions.",
    thread: [
      { from: "Adeyemi Tech Solutions", body: "We noticed a deduction for account maintenance fee that seems higher than usual for the month of February. See attached statement. Please clarify.", time: "1h ago" },
      { from: "FirstBank AI", body: "Dear Adeyemi Tech Solutions,<br><br>Thank you for reaching out. I have escalated your case to our specialist team as a matter of priority. A dedicated representative will review your request and contact you directly via this email thread.<br><br>We take your concern very seriously and appreciate your patience.<br><br>Kind regards,<br><b>AISA — First Bank Virtual Assistant</b>", time: "59m ago", isAuto: true },
    ],
  },
  {
    id: "4",
    from: "Google Security",
    fromEmail: "no-reply@google.com",
    subject: "Security alert",
    preview: "Google is notifying you of a new sign-in to your Google Account...",
    time: "1d ago",
    unread: false,
    hasAttachment: false,
    autoReplied: false,
    status: "received",
    summary: "Google notified of a new Windows sign‑in; check security activity.",
    thread: [
      {
        from: "Google Security",
        body: "We noticed a new sign-in to your Google Account on a Windows device. If this was you, you don't need to do anything. If not, we'll help you secure your account.",
        time: "1d ago",
      },
    ],
  },
];

const Inbox = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await api.getLogs();
      console.log("[AISA] Logs data received:", data);
      
      const logsArray: any[] = Array.isArray(data) ? data : (data?.logs || []);
      
      const mapped: Email[] = logsArray.map((log: any) => {
          const receivedDate = new Date(log.created_at);
          let timeStr = receivedDate.toLocaleDateString();
          if (new Date().toDateString() === receivedDate.toDateString()) {
              timeStr = receivedDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          }
          
          const isAutoReplied = log.status === "replied" || log.status === "REPLIED";
          
          const thread: any[] = [
             { from: log.sender?.split('@')[0] || "Customer", body: log.body || "", time: timeStr }
          ];
          
          if (isAutoReplied && log.reply_content) {
              thread.push({ 
                  from: "FirstBank AI", 
                  body: log.reply_content, 
                  time: timeStr, 
                  isAuto: true 
              });
          }

          return {
             id: String(log.id),
             from: log.sender?.split('@')[0] || "Customer",
             fromEmail: log.sender || "",
             subject: log.subject || "No Subject",
             preview: (log.body || "").substring(0, 100) + '...',
             time: timeStr,
             unread: log.status === "pending_review" || log.status === "PENDING_REVIEW",
             hasAttachment: false,
             autoReplied: isAutoReplied,
             status: log.status || "received",
             summary: log.summary || "",
             suggestedReply: log.reply_content || "",
             thread: thread
          };
      });
      setEmails(mapped);
    } catch (e: any) {
      console.error("[AISA] API FETCH ERROR:", e);
      if (!silent) toast.error(`Inbox error: ${e.message || 'Unknown error'}`);
      setEmails([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    // Check if token was passed in the URL (from backend OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      localStorage.setItem("aisa_token", urlToken);
      // Clean up the URL to hide the token
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    fetchLogs();
    
    // Auto refresh every 10 seconds
    const interval = setInterval(() => fetchLogs(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredEmails = emails.filter(
    (e) =>
      e.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {emails.length} messages {loading ? "(Loading...)" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fetchLogs()} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search emails..."
          className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex gap-6">
        {/* Email List */}
        <div className={`space-y-1 ${selectedEmail ? "w-2/5" : "w-full"} transition-all`}>
          <AnimatePresence>
            {filteredEmails.map((email, i) => (
              <motion.button
                key={email.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedEmail(email)}
                className={`w-full text-left p-4 rounded-xl border transition-all group ${
                  selectedEmail?.id === email.id
                    ? "border-primary/30 bg-primary/5 shadow-glow"
                    : "border-transparent hover:border-border hover:bg-card"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {email.unread ? (
                      <Circle className="w-2.5 h-2.5 fill-primary text-primary" />
                    ) : (
                      <Circle className="w-2.5 h-2.5 text-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm ${email.unread ? "font-semibold text-foreground" : "font-medium text-secondary-foreground"}`}>
                        {email.from}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {email.time}
                      </span>
                    </div>
                    <p className={`text-sm mb-1 truncate ${email.unread ? "text-foreground" : "text-muted-foreground"}`}>
                      {email.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{email.preview}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {email.autoReplied && (
                        <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-0 gap-1">
                          <Zap className="w-2.5 h-2.5" /> Auto-replied
                        </Badge>
                      )}
                      {email.hasAttachment && (
                        <Paperclip className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Thread View */}
        <AnimatePresence>
          {selectedEmail && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1"
            >
              <EmailThread
                email={selectedEmail}
                onClose={() => setSelectedEmail(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Inbox;
