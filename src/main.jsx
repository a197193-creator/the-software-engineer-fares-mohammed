import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { LanguageProvider } from "./LanguageContext";
import "./design.css";
import "./details.css";
import "./responsive.css";
import "./cinematic.css";
import "./welcome.css";

createRoot(document.getElementById("root")).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>,
);
