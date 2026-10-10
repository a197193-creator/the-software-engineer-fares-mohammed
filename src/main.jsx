import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { MotionSettingsProvider } from "./components/MotionSettings";
import { LanguageProvider } from "./LanguageContext";
import "./design.css";
import "./details.css";
import "./responsive.css";
import "./cinematic.css";
import "./welcome.css";
import "./intro.css";
import "./readability.css";
import "./typography.css";
import "./avatar-guide.css";
import "./avatar-motion.css";
import "./pointer.css";
import "./project-showcase.css";
import "./motion.css";
import "./journey-polish.css";
import "./welcome-integration.css";

createRoot(document.getElementById("root")).render(
  <LanguageProvider>
    <MotionSettingsProvider>
      <App />
    </MotionSettingsProvider>
  </LanguageProvider>,
);
