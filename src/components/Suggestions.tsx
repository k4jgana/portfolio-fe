import React from "react";

interface Props {
  suggestions: string[];
  onClick: (text: string) => void;
}

const Suggestions: React.FC<Props> = ({ suggestions, onClick }) => (
  <div className="footer-suggestions">
    {suggestions.map((text) => (
      <button
        key={text}
        type="button"
        className="suggestion-pill"
        onClick={() => onClick(text)}
      >
        {text}
      </button>
    ))}
  </div>
);

export default Suggestions;
