import React from "react";

interface HeaderProps {
  userEmail: string | "guest" | null;
}

const Header: React.FC<HeaderProps> = ({ userEmail }) => (
  <header>
    <div
      className="header-content"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div className="header-icon">🤖</div>
        <div className="header-text">
          <h1>AI Clanker</h1>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {userEmail && (
          <span
            style={{
              color: "#fff",
              fontSize: "0.95rem",
              fontWeight: 500,
              opacity: 0.8,
            }}
          >
            {userEmail === "guest" ? "Guest" : userEmail}
          </span>
        )}

        {/* GitHub link */}
        <a
          href="https://github.com/k4jgana/portfolio-be"
          target="_blank"
          rel="noopener noreferrer"
          title="Steal this code!"  
          style={{
            display: "inline-block",
            width: "24px",
            height: "24px",
            color: "#000",
            transition: "transform 0.2s, color 0.2s",
          }}
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            fill="blue"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%" }}
          >
            <title>Steal This Code!</title>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.997.108-.775.418-1.305.76-1.605-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 013.003-.403c1.02.005 2.045.138 3.003.403 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.81 1.096.81 2.21 0 1.595-.015 2.88-.015 3.27 0 .315.21.694.825.577C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </div>
  </header>
);

export default Header;
