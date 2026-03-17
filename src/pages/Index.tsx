import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Mail, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Mail, title: "Bank-Grade AI Responses", desc: "Responses tailored to First Bank products and services" },
  { icon: Clock, title: "24/7 Customer Support", desc: "Always on inbox monitoring with instant responses" },
  { icon: Shield, title: "Enterprise Security", desc: "No PINs, CVVs, or OTPs requested. Complete privacy." },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg outline outline-[#2a6fd9] gradient-primary flex items-center justify-center shadow-[0_0_15px_rgba(42,111,217,0.3)]">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-foreground tracking-tight">FirstBank<span className="text-accent ml-1">AI</span></span>
        </div>
        <Button
          onClick={() => navigate("/login")}
          variant="outline"
          className="border-border text-foreground hover:bg-secondary"
        >
          Sign In
        </Button>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Badge className="mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6 tracking-tight">
            Intelligent Email Automation for
            <span className="text-gradient"> First Bank</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            AISA monitors your email and intelligently responds to messages using First Bank's 130+ year heritage of trust, allowing you to focus on what matters most.
          </p>
          <div className="flex items-center gap-4 justify-center">
            <Button
              onClick={() => navigate("/login")}
              className="gradient-primary text-primary-foreground shadow-glow h-12 px-8 text-base font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-secondary h-12 px-8 text-base"
            >
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="grid grid-cols-3 gap-6 mt-24 max-w-3xl mx-auto"
        >
          {features.map((f, i) => (
            <div key={i} className="gradient-card border border-border rounded-xl p-6 shadow-card text-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const Badge = ({ className }: { className?: string }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full ${className}`}>
    <Zap className="w-3 h-3" /> Intelligent Email Automation
  </span>
);

export default Index;
