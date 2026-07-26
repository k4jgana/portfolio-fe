import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { portfolio } from "../data/portfolio.v1";
import { GitHubIcon } from "./GitHubIcon";
import Message from "./Message";
import type { MessageType } from "./Message";

export type ChatIntent = {
  id: number;
  prompt: string;
};

type ChatAssistantProps = {
  intent: ChatIntent | null;
};

type AskResponse = {
  answer?: unknown;
  detail?: unknown;
  visitor_id?: unknown;
  chat_session_id?: unknown;
};

const VISITOR_ID_STORAGE_KEY = "clanker_visitor_id";
const CHAT_SESSION_ID_STORAGE_KEY = "clanker_chat_session_id";
const CHAT_MESSAGES_STORAGE_KEY = "portfolio_chat_messages_v1";
const suggestions = [
  "What is Nenad building at HTEC?",
  "Tell me about his GenAI work",
  "What does his Anthropic certification cover?",
];

const rawBackendURL = (import.meta.env.VITE_BACKEND_URL ?? "").trim();

function resolveAskEndpoint() {
  if (!rawBackendURL) return "/ask";

  try {
    const parsed = new URL(rawBackendURL);
    const productionHost = !["localhost", "127.0.0.1"].includes(window.location.hostname);
    const localBackend = ["localhost", "127.0.0.1"].includes(parsed.hostname);
    if (productionHost && localBackend) return "/ask";
    return `${parsed.origin}${parsed.pathname}`.replace(/\/+$/, "") + "/ask";
  } catch {
    return rawBackendURL.replace(/\/+$/, "") + "/ask";
  }
}

function createClientId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function readStoredId(key: string) {
  try {
    return window.localStorage.getItem(key)?.trim() || createClientId();
  } catch {
    return createClientId();
  }
}

function readStoredMessages(): MessageType[] {
  try {
    const saved = JSON.parse(window.localStorage.getItem(CHAT_MESSAGES_STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved
      .filter(
        (message): message is MessageType =>
          typeof message === "object" &&
          message !== null &&
          (message.role === "user" || message.role === "ai") &&
          typeof message.content === "string",
      )
      .slice(-20);
  } catch {
    return [];
  }
}

function persist(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Chat still works when storage is restricted.
  }
}

export default function ChatAssistant({ intent }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<MessageType[]>(readStoredMessages);
  const [loading, setLoading] = useState(false);
  const [visitorId, setVisitorId] = useState(() => readStoredId(VISITOR_ID_STORAGE_KEY));
  const [chatSessionId, setChatSessionId] = useState(() =>
    readStoredId(CHAT_SESSION_ID_STORAGE_KEY),
  );
  const panelRef = useRef<HTMLElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const openChat = (draft = "") => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    if (draft) setQuery(draft);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    window.setTimeout(() => previousFocusRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!intent) return;
    openChat(intent.prompt);
  }, [intent]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("chat-open");
    window.setTimeout(() => textareaRef.current?.focus(), 80);

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeChat();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("chat-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    persist(VISITOR_ID_STORAGE_KEY, visitorId);
  }, [visitorId]);

  useEffect(() => {
    persist(CHAT_SESSION_ID_STORAGE_KEY, chatSessionId);
  }, [chatSessionId]);

  useEffect(() => {
    persist(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(conversation.slice(-20)));
  }, [conversation]);

  useEffect(() => {
    if (!isOpen || !messageListRef.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    messageListRef.current.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [conversation, isOpen, loading]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
  }, [query]);

  const submitMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const history = conversation
      .slice(-6)
      .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
      .join("\n");

    setQuery("");
    setConversation((current) => [...current, { role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const response = await fetch(resolveAskEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          history,
          email: "guest",
          visitor_id: visitorId,
          chat_session_id: chatSessionId,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as AskResponse;

      if (!response.ok) {
        const detail = typeof data.detail === "string" ? data.detail.trim() : "";
        throw new Error(detail || "The assistant is temporarily unavailable. Please try again.");
      }

      const answer = typeof data.answer === "string" ? data.answer.trim() : "";
      setConversation((current) => [
        ...current,
        { role: "ai", content: answer || "I didn’t receive a readable response. Please try again." },
      ]);

      if (typeof data.visitor_id === "string" && data.visitor_id.trim()) {
        setVisitorId(data.visitor_id.trim());
      }
      if (typeof data.chat_session_id === "string" && data.chat_session_id.trim()) {
        setChatSessionId(data.chat_session_id.trim());
      }
    } catch (error) {
      const networkError = error instanceof TypeError;
      const message =
        networkError
          ? "I can’t reach the AI service right now. The portfolio is still available—please try the assistant again in a moment."
          : error instanceof Error && error.message
            ? error.message
            : "The assistant is temporarily unavailable. Please try again.";
      setConversation((current) => [...current, { role: "ai", content: message, kind: "error" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void submitMessage(query);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage(query);
    }
  };

  return (
    <>
      <button className="chat-launcher" type="button" onClick={() => openChat()} aria-haspopup="dialog">
        <span className="chat-launcher__spark" aria-hidden="true">✦</span>
        <span>Ask my AI</span>
        <span className="chat-launcher__arrow" aria-hidden="true">↗</span>
      </button>

      {createPortal(<div className={`chat-layer ${isOpen ? "chat-layer--open" : ""}`} aria-hidden={!isOpen}>
        <button
          type="button"
          className="chat-backdrop"
          onClick={closeChat}
          aria-label="Close AI assistant"
          tabIndex={-1}
        />
        <aside
          className="chat-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-title"
        >
          <header className="chat-panel__header">
            <div className="chat-panel__identity">
              <span className="chat-panel__mark" aria-hidden="true">✦</span>
              <div>
                <p className="chat-panel__eyebrow">Pinecone-backed assistant</p>
                <h2 id="chat-title">Ask Nenad’s AI</h2>
              </div>
            </div>
            <button className="icon-button" type="button" onClick={closeChat} aria-label="Close AI assistant">
              <span aria-hidden="true">×</span>
            </button>
          </header>

          <a
            className="chat-source-link"
            href={portfolio.links.backend.href}
            target="_blank"
            rel="noreferrer"
            aria-label="View AI assistant source code on GitHub (opens in a new tab)"
          >
            <GitHubIcon />
            <span>View AI source</span>
            <span aria-hidden="true">↗</span>
          </a>

          <div className="chat-messages" ref={messageListRef} aria-live="polite" aria-busy={loading}>
            {conversation.length === 0 ? (
              <div className="chat-empty">
                <span className="chat-empty__glyph" aria-hidden="true">NK/AI</span>
                <h3>A more conversational résumé.</h3>
                <p>Ask about Nenad’s work, technical decisions, or the projects behind this page.</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <Message key={`${message.role}-${index}-${message.content.slice(0, 12)}`} message={message} />
              ))
            )}

            {loading && (
              <div className="chat-loading" role="status">
                <span>Nenad AI is thinking</span>
                <span className="chat-loading__dots" aria-hidden="true"><i /><i /><i /></span>
              </div>
            )}
          </div>

          <div className="chat-panel__composer">
            {conversation.length === 0 && (
              <div className="chat-suggestions" aria-label="Suggested questions">
                {suggestions.map((suggestion) => (
                  <button type="button" key={suggestion} onClick={() => void submitMessage(suggestion)}>
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <form className="chat-form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="chat-query">Ask a question about Nenad</label>
              <textarea
                ref={textareaRef}
                id="chat-query"
                rows={1}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Ask about Nenad’s work…"
                disabled={loading}
              />
              <button type="submit" disabled={loading || !query.trim()} aria-label="Send message">
                <span aria-hidden="true">↑</span>
              </button>
            </form>
            <p className="chat-hint">Enter to send · Shift + Enter for a new line</p>
          </div>
        </aside>
      </div>, document.body)}
    </>
  );
}
