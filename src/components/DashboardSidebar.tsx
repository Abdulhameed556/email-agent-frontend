import { useNavigate, useLocation } from "react-router-dom";
import { Inbox, FileText, Settings, Zap, BarChart3, LogOut } from "lucide-react";

const navItems = [
  { icon: Inbox, label: "Inbox", path: "/dashboard" },
  { icon: FileText, label: "Templates", path: "/dashboard/templates" },
  { icon: BarChart3, label: "Activity", path: "/dashboard/activity" },
  { icon: FileText, label: "Knowledge Base", path: "/dashboard/knowledge-base" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg outline outline-[#2a6fd9] gradient-primary flex items-center justify-center shadow-[0_0_15px_rgba(42,111,217,0.3)]">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-semibold text-foreground tracking-tight">FirstBank<span className="text-accent ml-1">AI</span></span>
        <span className="ml-auto text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full">
          BETA
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-sidebar-accent text-foreground shadow-glow"
                  : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => {
            localStorage.removeItem("aisa_token");
            navigate("/");
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
