import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CdManager from "./components/CdManager";

const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
const Root = normalizedPath === "/cdinja" ? CdManager : App;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
