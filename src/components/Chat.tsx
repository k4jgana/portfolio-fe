import React from "react";
import Message from "./Message";
import type { MessageType } from "./Message"; // ✅ type-only import
import Loading from "./Loading";

interface Props {
  conversation: MessageType[];
  typingMessageIndex: number | null;
  displayedContent: string;
  loading: boolean;
  showStartupNotice: boolean; 
}

const Chat: React.FC<Props> = ({
  conversation,
  typingMessageIndex,
  displayedContent,
  loading,
  showStartupNotice,
}) => {
  return (
    <div className="chat-container">
      {showStartupNotice && (
        <div className="startup-notice">
          ⏳ First request may take up to 2 minutes while the server starts.
        </div>
      )}

      {conversation.map((msg, idx) => (
        <Message
          key={idx}
          message={msg}
          isTyping={idx === typingMessageIndex}
          displayedContent={displayedContent}
        />
      ))}

      {loading && <Loading />}

      <div />
    </div>
  );
};

export default Chat;
