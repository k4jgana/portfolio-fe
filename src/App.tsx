import React, { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import Chat from "./components/Chat";
import Footer from "./components/Footer";
import type { MessageType } from "./components/Message";
import "./styles/index.css";


const SUGGESTIONS = [
  "Nenad Career Info",
  "Album recommendations by Nenad",
  "Movie recommendations by Nenad",
];

const backendURL = import.meta.env.VITE_BACKEND_URL;
// const backendURL = "http://127.0.0.1:8000/"

const App: React.FC = () => {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [typingMessageIndex, setTypingMessageIndex] = useState<number | null>(null);
  const [displayedContent, setDisplayedContent] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showStartupNotice = loading && conversation.length === 1 && conversation[0].role === "user";


useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [conversation, displayedContent]);


  useEffect(() => {
    if (typingMessageIndex === null) return;
    if (typingMessageIndex >= conversation.length) return;

    const message = conversation[typingMessageIndex];
    if (!message || message.role !== "ai") return;

    if (typingIndex < message.content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent(message.content.slice(0, typingIndex + 1));
        setTypingIndex((t) => t + 1);
      }, 20);
      return () => clearTimeout(timeout);
    } else {
      setDisplayedContent(message.content);
      setTypingMessageIndex(null);
      setTypingIndex(0);
    }
  }, [typingIndex, typingMessageIndex, conversation]);

  const sendMessage = async (text: string) => {
    const history = conversation
      .slice(-6)
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    try {
      const response = await fetch(`${backendURL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, history: history || "" }),
      });

      const data = await response.json();
      const answer = data.answer || "(no response)";
      const aiIndex = conversation.length + 1;

      setConversation((prev) => [...prev, { role: "ai", content: answer }]);
      setTypingMessageIndex(aiIndex);
      setDisplayedContent("");
      setTypingIndex(0);
    } catch {
      setConversation((prev) => [
        ...prev,
        { role: "ai", content: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    const text = query.trim();
    setQuery("");
    setConversation((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    sendMessage(text);
  };

  const handleSuggestionClick = (text: string) => {
    if (loading) return;
    setConversation((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    sendMessage(text);
  };

  return (
    <div className="app-container">
      <Header />
      <main>
        <Chat
          conversation={conversation}
          typingMessageIndex={typingMessageIndex}
          displayedContent={displayedContent}
          loading={loading}
          showStartupNotice={showStartupNotice}
        />
        <div ref={messagesEndRef} />
      </main>
      <Footer
        query={query}
        setQuery={setQuery}
        handleSubmit={handleSubmit}
        loading={loading}
        suggestions={conversation.length === 0 ? SUGGESTIONS : []}
        onSuggestionClick={handleSuggestionClick}
      />
    </div>
  );
};

export default App;
