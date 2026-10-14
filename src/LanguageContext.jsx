import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { arabic, heroCopy, welcomeCopy } from "./locales";
import { guideCopy } from "./guideDialogue";
const LanguageContext = createContext(null);
function readLanguage() {
  try {
    const value = localStorage.getItem("fares-language");
    return value === "en" || value === "ar" ? value : null;
  } catch {
    return null;
  }
}
export function LanguageProvider({ children }) {
  const [language, setValue] = useState(() => readLanguage() || "en");
  const setLanguage = useCallback((value) => {
    if (value !== "en" && value !== "ar") return;
    setValue(value);
    try {
      localStorage.setItem("fares-language", value);
    } catch {
      /* Works when storage is unavailable. */
    }
  }, []);
  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);
  const tr = useCallback(
    (text) => (language === "ar" ? arabic[text] || text : text),
    [language],
  );
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        tr,
        hero: heroCopy[language],
        welcome: welcomeCopy[language],
        guide: guideCopy[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  return useContext(LanguageContext);
}
