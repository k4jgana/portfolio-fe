import React, { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import Chat from "./components/Chat";
import Footer from "./components/Footer";
import Login from "./components/Login"; 
import type { MessageType } from "./components/Message";
import "./styles/index.css";

// Backend URL
const backendURL = import.meta.env.VITE_BACKEND_URL;

const App: React.FC = () => {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [typingMessageIndex, setTypingMessageIndex] = useState<number | null>(null);
  const [displayedContent, setDisplayedContent] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [userEmail, setUserEmail] = useState<string | "guest" | null>(null);

  // Suggestions state (was previously a constant)
  const [suggestions, setSuggestions] = useState<string[]>([
    "Give me Nenad Career Info",
    "Nenad work related to GenAI",
    "AI Stack Nenad used",
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat container
  useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [conversation, displayedContent]);

  const showStartupNotice = loading && conversation.length === 1 && conversation[0].role === "user";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, displayedContent]);

  // Typing effect for AI messages
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

  // Send message to backend
  const sendMessage = async (text: string) => {
    const history = conversation
      .slice(-6)
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    try {
      const response = await fetch(`${backendURL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          history: history || "",
          email: userEmail, 
        }),
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

  // Handle form submit
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    const text = query.trim();
    setQuery("");
    setConversation((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    sendMessage(text);
  };

  // Handle suggestion click and remove clicked suggestion
  const handleSuggestionClick = (text: string) => {
    if (loading) return;

    // Add to conversation
    setConversation((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    sendMessage(text);

    // Remove clicked suggestion
    setSuggestions((prev) => prev.filter((s) => s !== text));
  };

  return (
    <div className="app-container">
      <Header userEmail={userEmail} />

      {userEmail === null && (
        <Login onLogin={(email) => setUserEmail(email)} />
      )}

      <main>
        <Chat
          conversation={conversation}
          typingMessageIndex={typingMessageIndex}
          displayedContent={displayedContent}
          loading={loading}
          showStartupNotice={showStartupNotice}
          chatContainerRef={chatContainerRef}
        />
        <div ref={messagesEndRef} />
      </main>

      <Footer
        query={query}
        setQuery={setQuery}
        handleSubmit={handleSubmit}
        loading={loading}
        suggestions={suggestions}   // Pass the state
        onSuggestionClick={handleSuggestionClick} // Updated handler
      />
    </div>
  );
};

export default App; 