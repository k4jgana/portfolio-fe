import React from "react";
import Suggestions from "./Suggestions";

interface Props {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e?: React.FormEvent) => void;
  loading: boolean;
  suggestions: string[];
  onSuggestionClick: (text: string) => void;
}

const Footer: React.FC<Props> = ({
  query,
  setQuery,
  handleSubmit,
  loading,
  suggestions,
  onSuggestionClick,
}) => (
  <footer>
    {suggestions.length > 0 && <Suggestions suggestions={suggestions} onClick={onSuggestionClick} />}

    <form className="input-container" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about Nenad..."
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading || !query.trim()}>
        {loading ? (
          <svg className="button-icon spinning" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          </svg>
        ) : (
          <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2z" />
          </svg>
        )}
      </button>
    </form>
  </footer>
);

export default Footer;
