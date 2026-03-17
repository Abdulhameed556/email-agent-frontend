import React from 'react';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const navigate = useNavigate();
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleSocialLogin = (provider: 'google' | 'microsoft') => {
    window.location.href = `${BACKEND_BASE_URL}/auth/login/${provider}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="p-10 bg-card border border-border shadow-card rounded-2xl w-full max-w-md relative z-10">
        <header className="text-center mb-10">
          <div className="w-12 h-12 mx-auto rounded-xl outline outline-[#2a6fd9] gradient-primary flex items-center justify-center shadow-[0_0_15px_rgba(42,111,217,0.3)] mb-6">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">FirstBank <span className="text-accent">AI</span></h1>
          <p className="text-muted-foreground mt-2 text-sm">Sign in with your corporate account to continue</p>
        </header>

        <div className="space-y-4 pt-2">
          {/* Real Google OAuth Login */}
          <div className="flex justify-center w-full bg-muted/30 border border-border rounded-lg hover:bg-muted/50 transition-all shadow-sm p-1">
            <GoogleLogin
               onSuccess={credentialResponse => {
                  const token = credentialResponse.credential;
                  if (token) {
                    localStorage.setItem("aisa_token", token);
                    navigate("/dashboard");
                  }
               }}
               onError={() => {
                  console.error('Google Login Failed');
               }}
            />
          </div>

          {/* Microsoft Button */}
          <button
            onClick={() => handleSocialLogin('microsoft')}
            className="flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-semibold text-foreground bg-muted/30 border border-border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 23 23">
              <path fill="#f3f3f3" d="M0 0h11v11H0z" />
              <path fill="#f3f3f3" d="M12 0h11v11H12z" />
              <path fill="#f3f3f3" d="M0 12h11v23H0z" />
              <path fill="#f3f3f3" d="M12 12h11v11H12z" />
            </svg>
            Sign in with Microsoft
          </button>
        </div>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          By signing in, you agree to First Bank's Terms of Service and Privacy Policy.
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;