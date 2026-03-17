import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Zap, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface Template {
  id: string;
  name: string;
  trigger: string;
  body: string;
  active: boolean;
  usageCount: number;
}

const defaultTemplates: Template[] = [
  {
    id: "1",
    name: "Account Inquiry Response",
    trigger: "Subject contains: account, open, savings, current",
    body: "Dear Valued Customer,\n\nThank you for your inquiry. First Bank offers a wide range of account options including Savings, Current, FirstGem, Domiciliary, and SME accounts.\n\nTo get started, you can visit any First Bank branch with a valid ID and two passport photographs, or download the FirstMobile App to begin your application.\n\nKind regards,\nAISA — First Bank Virtual Assistant",
    active: true,
    usageCount: 142,
  },
  {
    id: "2",
    name: "Loan Application Acknowledgment",
    trigger: "Subject contains: loan, credit, borrow, advance",
    body: "Dear Valued Customer,\n\nThank you for your interest in our loan products. First Bank offers FirstCredit, Salary Loans, Personal Home Loans, and Automobile Loans.\n\nA relationship manager will contact you within 24 hours to discuss your options and guide you through the application process.\n\nKind regards,\nAISA — First Bank Virtual Assistant",
    active: true,
    usageCount: 87,
  },
  {
    id: "3",
    name: "Card Issue Response",
    trigger: "Subject contains: card, block, stolen, ATM",
    body: "Dear Valued Customer,\n\nWe understand the urgency of your card concern. For immediate security:\n\n1. Open the FirstMobile App → Cards → Select Card → Block Card\n2. Or dial *894*911# to instantly block your card\n\nPlease visit your nearest First Bank branch with a valid ID for a replacement card.\n\nKind regards,\nAISA — First Bank Virtual Assistant",
    active: false,
    usageCount: 256,
  },
];

const Templates = () => {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [editing, setEditing] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: "", trigger: "", body: "" });

  const toggleTemplate = (id: string) => {
    setTemplates(templates.map((t) => (t.id === id ? { ...t, active: !t.active } : t)));
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const addTemplate = () => {
    if (!newTemplate.name || !newTemplate.body) return;
    setTemplates([
      ...templates,
      {
        id: Date.now().toString(),
        ...newTemplate,
        active: true,
        usageCount: 0,
      },
    ]);
    setNewTemplate({ name: "", trigger: "", body: "" });
    setShowNew(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Response Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure automated reply templates and triggers
          </p>
        </div>
        <Button onClick={() => setShowNew(true)} className="gradient-primary text-primary-foreground shadow-glow">
          <Plus className="w-4 h-4 mr-2" /> New Template
        </Button>
      </div>

      {/* New Template Form */}
      {showNew && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-card border border-primary/20 rounded-xl p-6 mb-6 shadow-glow"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Create New Template</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Template Name</label>
              <Input
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="e.g., Support Acknowledgment"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Trigger Rule</label>
              <Input
                value={newTemplate.trigger}
                onChange={(e) => setNewTemplate({ ...newTemplate, trigger: e.target.value })}
                placeholder="e.g., Subject contains: help, support"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Response Body</label>
              <Textarea
                value={newTemplate.body}
                onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                placeholder="Write your auto-response..."
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNew(false)} className="border-border text-muted-foreground">
                Cancel
              </Button>
              <Button onClick={addTemplate} className="gradient-primary text-primary-foreground shadow-glow">
                Create Template
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Template List */}
      <div className="space-y-3">
        {templates.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="gradient-card border border-border rounded-xl p-5 shadow-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${template.active ? "bg-primary/10" : "bg-secondary"}`}>
                  <Zap className={`w-4 h-4 ${template.active ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{template.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{template.trigger}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs bg-secondary text-muted-foreground border-0 gap-1">
                  <Mail className="w-3 h-3" /> {template.usageCount}
                </Badge>
                <Switch checked={template.active} onCheckedChange={() => toggleTemplate(template.id)} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3 pl-11">
              {template.body}
            </p>
            <div className="flex gap-2 pl-11">
              <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => deleteTemplate(template.id)}
                className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
