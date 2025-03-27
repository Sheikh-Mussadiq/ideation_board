import React, { createContext, useState, useContext } from "react";

// Available languages
export const LANGUAGES = {
  ENGLISH: "en",
  GERMAN: "de",
};

// Create the Language Context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(LANGUAGES.ENGLISH);

  // Function to change the current language
  const changeLanguage = (newLanguage) => {
    if (Object.values(LANGUAGES).includes(newLanguage)) {
      localStorage.setItem("userLanguage", newLanguage);
      setLanguage(newLanguage);
    }
  };

  // Load saved language preference
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem("userLanguage");
    if (savedLanguage && Object.values(LANGUAGES).includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        languages: LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
