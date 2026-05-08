import { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi there! 👋 I'm your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // 👇 Sends message to YOUR Node.js backend (not directly to OpenAI)
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't get a response.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);

    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Could not reach the server. Is it running?" }]);
    }

    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0f4f8", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>AI Assistant</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block" }}></span>
              Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10, minHeight: 340, maxHeight: 400 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              {m.role === "assistant" && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, marginRight: 7, flexShrink: 0, alignSelf: "flex-end" }}>🤖</div>
              )}
              <div style={{
                maxWidth: "75%", padding: "10px 14px",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: m.role === "user" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#f3f4f6",
                color: m.role === "user" ? "#fff" : "#1f2937",
                fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap"
              }}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🤖</div>
              <div style={{ background: "#f3f4f6", borderRadius: "18px 18px 18px 4px", padding: "10px 16px", display: "flex", gap: 4 }}>
                {[0,1,2].map(d => (
                  <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", animation: "bounce 1.2s infinite", animationDelay: `${d*0.2}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ borderTop: "1px solid #e5e7eb", padding: "12px 14px", display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message..."
            style={{ flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 24, padding: "10px 16px", fontSize: 14, outline: "none" }}
            onFocus={e => e.target.style.borderColor = "#6366f1"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ width: 42, height: 42, borderRadius: "50%", border: "none", background: loading || !input.trim() ? "#e5e7eb" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: 18, cursor: loading || !input.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >➤</button>
        </div>
      </div>
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}