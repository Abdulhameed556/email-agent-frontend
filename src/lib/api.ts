export const BASE_URL = "https://email-agent-production-b4ef.up.railway.app";

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("aisa_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });
  
  // if (res.status === 401) {
  //   window.location.href = `${BASE_URL}/auth/login/google`;
  //   throw new Error("Not authenticated");
  // }
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Error Response:", errorText);
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getLogs: () => apiFetch("/api/logs"),
  sendReply: (logId: number, content: string, file?: File) => {
    const formData = new FormData();
    formData.append("reply_content", content);
    if (file) formData.append("file", file);
    
    return fetch(`${BASE_URL}/api/logs/${logId}/send`, {
      method: "POST",
      headers: {
        ...(localStorage.getItem("aisa_token") ? { "Authorization": `Bearer ${localStorage.getItem("aisa_token")}` } : {}),
      },
      credentials: "include",
      body: formData,
    }).then(async (res) => {
      if (!res.ok) throw new Error(`Reply error: ${res.status}`);
      return res.json();
    });
  },
  setAutoReply: (enabled: boolean) =>
    apiFetch("/api/settings/auto-reply", {
      method: "POST",
      body: JSON.stringify({ enabled }),
    }),
  getHealth: () => apiFetch("/api/health"),
  getKnowledgeFiles: () => apiFetch("/api/knowledge/files"),
  uploadKnowledge: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`${BASE_URL}/api/knowledge/upload`, {
      method: "POST",
      credentials: "include", // for session auth
      body: formData, // No Content-Type header — browser sets multipart boundary
    }).then(async (res) => {
      if (!res.ok) throw new Error(`Upload error: ${res.status}`);
      return res.json();
    });
  },
  deleteKnowledgeFile: (name: string) =>
    apiFetch(`/api/knowledge/files/${name}`, { method: "DELETE" }),
};
