import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export type MessageType = {
  role: "user" | "ai";
  content: string;
};

interface Props {
  message: MessageType;
  isTyping?: boolean;
  displayedContent?: string;
}

const Message: React.FC<Props> = ({ message, isTyping, displayedContent }) => {
  const content = isTyping ? displayedContent : message.content;

  return (
    <div className={`message-wrapper ${message.role}`}>
      <div className="message-card">
        <div className="message-meta">{message.role === "user" ? "You" : "Clanker"}</div>
        <div className="message-markdown markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Message;
