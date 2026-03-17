import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Bell, Shield, Mail, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { toast } from "sonner";

const DashboardSettings = () => {
  const [autoResponderActive, setAutoResponderActive] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Extract real email from JWT token in localStorage
  const getLoggedInEmail = () => {
    const token = localStorage.getItem("aisa_token");
    if (!token) return "not-signed-in@company.com";
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).email || "User";
    } catch (e) {
      return "User";
    }
  };

  const [connectedEmail, setConnectedEmail] = useState(getLoggedInEmail());
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleAutoReply = async (checked: boolean) => {
    setIsToggling(true);
    try {
      await api.setAutoReply(checked);
      setAutoResponderActive(checked);
      toast.success(checked ? "Auto-reply enabled" : "Auto-reply paused");
    } catch (error) {
      toast.error("Failed to update auto-reply status");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your FirstBank AI configuration</p>
      </div>

      <div className="space-y-6">
        {/* Auto Responder Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border rounded-xl p-6 shadow-card transition-all ${
            autoResponderActive
              ? "gradient-card border-primary/20 shadow-glow"
              : "gradient-card border-border"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${autoResponderActive ? "gradient-primary shadow-glow" : "bg-secondary"}`}>
                <Zap className={`w-5 h-5 ${autoResponderActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Auto Responder</h3>
                <p className="text-xs text-muted-foreground">
                  {autoResponderActive ? "Actively monitoring and responding" : "Paused — no auto-replies"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className={`text-[10px] border-0 ${autoResponderActive ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"}`}>
                {autoResponderActive ? "ACTIVE" : "PAUSED"}
              </Badge>
              <Switch checked={autoResponderActive} onCheckedChange={handleToggleAutoReply} disabled={isToggling} />
            </div>
          </div>
        </motion.div>

        {/* Connected Email */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="gradient-card border border-border rounded-xl p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Connected Email</h3>
          </div>
          <div className="flex gap-3">
            <Input
              value={connectedEmail}
              onChange={(e) => setConnectedEmail(e.target.value)}
              className="bg-secondary border-border text-foreground font-mono text-sm"
            />
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary shrink-0">
              <Globe className="w-4 h-4 mr-2" /> Reconnect
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Connected via Microsoft Exchange · Last synced 2m ago
          </p>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="gradient-card border border-border rounded-xl p-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                <p className="text-xs text-muted-foreground">Get alerts for new messages requiring attention</p>
              </div>
            </div>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="gradient-card border border-border rounded-xl p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Security</h3>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-secondary">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-secondary">
              Manage Connected Accounts
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardSettings;
