import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const WELCOME = "Hi! I'm the Evriel Systems assistant. I can help you learn about our AI, automation, and intelligent systems services. What can I help you with?";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  // Stop pulse after first open
  useEffect(() => {
    if (open) setPulse(false);
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Send only role + content (not the welcome message system role)
      const apiMessages = newMessages
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. You can reach us directly at contact@evrielsystems.com.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <style>{`
.evc{position:fixed;bottom:24px;right:24px;z-index:990;font-family:'Inter',-apple-system,sans-serif}

/* Bubble */
.evc__btn{width:56px;height:56px;border-radius:50%;background:var(--ac,#4D9FFF);color:#04101F;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(77,159,255,0.35);transition:all 0.4s ${EASE}}
.evc__btn:hover{transform:scale(1.08);box-shadow:0 6px 32px rgba(77,159,255,0.5)}
.evc__btn--pulse{animation:evcPulse 2.5s ease-in-out infinite}
@keyframes evcPulse{0%,100%{box-shadow:0 4px 24px rgba(77,159,255,0.35)}50%{box-shadow:0 4px 24px rgba(77,159,255,0.35),0 0 0 10px rgba(77,159,255,0.12)}}

/* Panel */
.evc__panel{position:absolute;bottom:72px;right:0;width:380px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 120px);background:rgba(10,15,28,0.97);backdrop-filter:blur(24px);border:1px solid rgba(168,210,255,0.12);display:flex;flex-direction:column;opacity:0;transform:translateY(16px) scale(0.96);pointer-events:none;transition:opacity 0.35s ${EASE},transform 0.35s ${EASE};overflow:hidden}
.evc__panel--open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}

/* Header */
.evc__head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid rgba(168,210,255,0.08);flex-shrink:0}
.evc__title{display:flex;align-items:center;gap:10px}
.evc__dot{width:8px;height:8px;border-radius:50%;background:#34D399;box-shadow:0 0 8px rgba(52,211,153,0.5)}
.evc__name{font-family:'DM Serif Display',Georgia,serif;font-size:15px;color:#fff;letter-spacing:0.02em}
.evc__sub{font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:0.06em;text-transform:uppercase;margin-top:1px}
.evc__close{width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,0.08);background:transparent;color:rgba(255,255,255,0.4);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s}
.evc__close:hover{border-color:rgba(255,255,255,0.2);color:#fff;background:rgba(255,255,255,0.05)}

/* Messages */
.evc__msgs{flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:12px;scrollbar-width:thin;scrollbar-color:rgba(168,210,255,0.12) transparent}
.evc__msgs::-webkit-scrollbar{width:4px}
.evc__msgs::-webkit-scrollbar-thumb{background:rgba(168,210,255,0.15);border-radius:2px}

/* Message bubbles */
.evc__msg{max-width:85%;padding:10px 14px;font-size:13.5px;line-height:1.6;word-wrap:break-word;animation:evcFadeIn 0.35s ${EASE}}
.evc__msg--a{align-self:flex-start;background:rgba(168,210,255,0.07);border:1px solid rgba(168,210,255,0.1);color:rgba(255,255,255,0.75);border-radius:2px 12px 12px 2px}
.evc__msg--u{align-self:flex-end;background:rgba(77,159,255,0.18);border:1px solid rgba(77,159,255,0.25);color:rgba(255,255,255,0.88);border-radius:12px 2px 2px 12px}
@keyframes evcFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* Typing indicator */
.evc__typing{align-self:flex-start;display:flex;gap:4px;padding:12px 16px;background:rgba(168,210,255,0.05);border:1px solid rgba(168,210,255,0.08);border-radius:2px 12px 12px 2px;animation:evcFadeIn 0.3s ${EASE}}
.evc__typing span{width:6px;height:6px;border-radius:50%;background:rgba(168,210,255,0.35);animation:evcBounce 1.4s ease-in-out infinite}
.evc__typing span:nth-child(2){animation-delay:0.15s}
.evc__typing span:nth-child(3){animation-delay:0.3s}
@keyframes evcBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}

/* Input */
.evc__input{display:flex;align-items:center;gap:8px;padding:12px 14px;border-top:1px solid rgba(168,210,255,0.08);flex-shrink:0;background:rgba(0,0,0,0.2)}
.evc__input textarea{flex:1;background:transparent;border:none;color:#fff;font-size:13.5px;font-family:inherit;line-height:1.5;resize:none;outline:none;max-height:80px;scrollbar-width:none}
.evc__input textarea::-webkit-scrollbar{display:none}
.evc__input textarea::placeholder{color:rgba(255,255,255,0.2)}
.evc__send{width:34px;height:34px;border-radius:50%;background:var(--ac,#4D9FFF);color:#04101F;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s ${EASE};flex-shrink:0}
.evc__send:hover{background:var(--ac2,#A8D2FF);transform:scale(1.08)}
.evc__send:disabled{opacity:0.35;cursor:not-allowed;transform:none}

/* Quick actions */
.evc__quick{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 14px}
.evc__qbtn{font-size:11px;padding:6px 12px;border:1px solid rgba(168,210,255,0.15);background:rgba(168,210,255,0.04);color:rgba(255,255,255,0.5);cursor:pointer;transition:all 0.3s;border-radius:99px;white-space:nowrap;font-family:inherit}
.evc__qbtn:hover{border-color:rgba(77,159,255,0.5);color:var(--ac2,#A8D2FF);background:rgba(77,159,255,0.08)}

/* Footer */
.evc__foot{text-align:center;padding:6px;font-size:9px;color:rgba(255,255,255,0.12);letter-spacing:0.06em;border-top:1px solid rgba(255,255,255,0.03);flex-shrink:0}

@media(max-width:480px){
  .evc{bottom:16px;right:16px}
  .evc__panel{width:calc(100vw - 32px);height:calc(100vh - 100px);bottom:68px;right:0}
}
      `}</style>

      <div className="evc">
        {/* Chat panel */}
        <div className={`evc__panel${open ? " evc__panel--open" : ""}`}>
          {/* Header */}
          <div className="evc__head">
            <div className="evc__title">
              <div className="evc__dot" />
              <div>
                <div className="evc__name">Evriel Assistant</div>
                <div className="evc__sub">AI-Powered Support</div>
              </div>
            </div>
            <button className="evc__close" onClick={() => setOpen(false)}>
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="evc__msgs" ref={scrollRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`evc__msg evc__msg--${m.role === "assistant" ? "a" : "u"}`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="evc__typing">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          {/* Quick action chips — only show at the start */}
          {messages.length <= 1 && !loading && (
            <div className="evc__quick">
              {[
                "What services do you offer?",
                "Tell me about your projects",
                "How does your process work?",
                "Which industries do you serve?",
              ].map((q) => (
                <button
                  key={q}
                  className="evc__qbtn"
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => {
                      setInput(q);
                      const fakeEvent = { key: "Enter", shiftKey: false, preventDefault: () => {} };
                      // Trigger send directly
                      const userMsg = { role: "user", content: q };
                      const newMessages = [...messages, userMsg];
                      setMessages(newMessages);
                      setInput("");
                      setLoading(true);
                      fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          messages: newMessages.map((m) => ({
                            role: m.role,
                            content: m.content,
                          })),
                        }),
                      })
                        .then((r) => r.json())
                        .then((data) =>
                          setMessages((prev) => [
                            ...prev,
                            { role: "assistant", content: data.reply },
                          ])
                        )
                        .catch(() =>
                          setMessages((prev) => [
                            ...prev,
                            {
                              role: "assistant",
                              content:
                                "Sorry, I'm having trouble connecting. Please reach us at contact@evrielsystems.com.",
                            },
                          ])
                        )
                        .finally(() => setLoading(false));
                    }, 0);
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="evc__input">
            <textarea
              ref={inputRef}
              rows={1}
              placeholder="Ask about our services..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              className="evc__send"
              onClick={send}
              disabled={!input.trim() || loading}
            >
              {loading ? <Loader2 size={16} className="evc__spin" /> : <Send size={15} />}
            </button>
          </div>

          <div className="evc__foot">Powered by Evriel Systems</div>
        </div>

        {/* Floating bubble */}
        <button
          className={`evc__btn${pulse ? " evc__btn--pulse" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close chat" : "Open chat"}
        >
          {open ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>
    </>
  );
}
