import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Mail,
  Clock,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EmailThread from "@/components/EmailThread";
import { api } from "@/lib/api";

interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: any;
}

const Activity = () => {
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [stats, setStats] = useState<StatCard[]>([
    { label: "TOTAL EMAILS", value: "—", change: "", icon: Mail },
    { label: "PENDING REVIEW", value: "—", change: "", icon: Clock },
    { label: "AUTO‑REPLIED", value: "—", change: "", icon: Zap },
    { label: "ESCALATED", value: "—", change: "", icon: AlertTriangle },
  ]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.getLogs();

      // data could be an array or { logs: [...] }
      const logs: any[] = Array.isArray(data) ? data : data.logs || [];

      const total = logs.length;
      const pending = logs.filter(
        (l: any) => l.status === "PENDING_REVIEW" || l.status === "pending_review"
      ).length;
      const replied = logs.filter(
        (l: any) => l.status === "REPLIED" || l.status === "replied" || l.auto_reply_sent
      ).length;
      const escalated = logs.filter(
        (l: any) => l.status === "ESCALATED" || l.status === "escalated"
      ).length;

      setStats([
        { label: "TOTAL EMAILS", value: String(total), change: "", icon: Mail },
        { label: "PENDING REVIEW", value: String(pending), change: "", icon: Clock },
        { label: "AUTO‑REPLIED", value: String(replied), change: "", icon: Zap },
        { label: "ESCALATED", value: String(escalated), change: "", icon: AlertTriangle },
      ]);

      const recent = logs.slice(0, 10).map((log: any) => {
        const receivedDate = new Date(log.received_at || log.created_at);
        let timeStr = receivedDate.toLocaleDateString();
        if (new Date().toDateString() === receivedDate.toDateString()) {
          timeStr = receivedDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        const statusText =
          log.status === "REPLIED" || log.status === "replied" || log.auto_reply_sent
            ? "Auto Replied"
            : log.status === "ESCALATED" || log.status === "escalated"
            ? "Escalated"
            : "Pending";

        return {
          logId: log.id,
          status: statusText,
          sender: log.sender?.split("@")[0] || "Unknown",
          subject: log.subject || "No Subject",
          date: timeStr,
          email: {
            id: String(log.id),
            from: log.sender?.split("@")[0] || "Unknown",
            fromEmail: log.sender || "",
            subject: log.subject || "No Subject",
            summary: log.llm_summary || log.summary || "",
            suggestedReply: log.generated_reply || log.reply_content || "",
            thread: [
              {
                from: log.sender?.split("@")[0] || "Unknown",
                body: log.body_snippet || log.body || "",
                time: timeStr,
              },
              ...(log.auto_reply_sent || log.generated_reply
                ? [
                    {
                      from: "FirstBank AI",
                      body: log.generated_reply || log.reply_content || "Automated response generated.",
                      time: timeStr,
                      isAuto: true,
                    },
                  ]
                : []),
            ],
          },
        };
      });

      setRecentActivity(recent);
    } catch (err) {
      console.error("Failed to fetch activity data, using fallback", err);
      // keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex gap-6">
      {/* LEFT SIDE CONTENT */}
      <div className="flex-1">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Activity</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your email automation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="gradient-card border border-border rounded-xl p-5 shadow-card"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                {stat.change && (
                  <span className="text-xs text-success flex items-center gap-0.5 font-mono">
                    {stat.change} <ArrowUpRight className="w-3 h-3" />
                  </span>
                )}
              </div>

              <p className="text-2xl font-semibold text-foreground">
                {stat.value}
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="gradient-card border border-border rounded-xl shadow-card">
          {/* Header */}
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Activity
            </h2>

            <Button
              size="sm"
              variant="outline"
              onClick={fetchData}
              className="border-border text-muted-foreground"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Sender</th>
                <th className="text-left px-5 py-3">Subject</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {loading && recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    Loading activity data...
                  </td>
                </tr>
              ) : recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    No activity yet. Send a test email to get started.
                  </td>
                </tr>
              ) : (
                recentActivity.map((item, i) => (
                  <motion.tr
                    key={item.logId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-secondary/30"
                  >
                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-md font-medium ${
                          item.status === "Auto Replied"
                            ? "bg-primary/10 text-primary"
                            : item.status === "Escalated"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Sender */}
                    <td className="px-5 py-4 text-foreground">
                      {item.sender}
                    </td>

                    {/* Subject */}
                    <td className="px-5 py-4 text-muted-foreground">
                      {item.subject}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-muted-foreground">
                      {item.date}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      {item.status === "Auto Replied" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedEmail(item.email)}
                        >
                          View Thread
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="gradient-primary text-primary-foreground"
                          onClick={() => setSelectedEmail(item.email)}
                        >
                          Review & Send
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT SIDE EMAIL THREAD PANEL */}
      {selectedEmail && (
        <div className="w-[420px] shrink-0">
          <EmailThread
            email={selectedEmail}
            onClose={() => setSelectedEmail(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Activity;