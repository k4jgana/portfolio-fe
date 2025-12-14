import React from "react";

const Loading: React.FC = () => (
  <div className="loading-wrapper">
    <div className="loading-content">
      <div className="message-meta">Assistant</div>
      <div className="loader"></div>
    </div>
  </div>
);

export default Loading;
