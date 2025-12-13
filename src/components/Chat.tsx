import React from "react";
import Message from "./Message";
import type { MessageType } from "./Message"; // ✅ type-only import
import Loading from "./Loading";

interface Props {
  conversation: MessageType[];
  typingMessageIndex: number | null;
  displayedContent: string;
  loading: boolean;
}

const Chat: React.FC<Props> = ({ conversation, typingMessageIndex, displayedContent, loading }) => {
  return (
    <div className="chat-container">
      {conversation.map((msg, idx) => (
        <Message
          key={idx}
          message={msg}
          isTyping={idx === typingMessageIndex}
          displayedContent={displayedContent}
        />
      ))}

      {loading && <Loading />}
      {/* This div can be used for scrolling if a ref is passed from parent */}
      <div />
    </div>
  );
};

export default Chat;
