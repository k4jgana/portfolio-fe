import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type MessageType = {
  role: "user" | "ai";
  content: string;
  kind?: "default" | "error";
};

interface Props {
  message: MessageType;
}

const Message: React.FC<Props> = ({ message }) => {
  return (
    <article className={`message message--${message.role} ${message.kind === "error" ? "message--error" : ""}`}>
      <p className="message__author">{message.role === "user" ? "You" : "Nenad AI"}</p>
      <div className="message__bubble">
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
};

export default Message;
