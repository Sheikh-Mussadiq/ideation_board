import React, { useState, useEffect, memo } from "react";
import { useLanguage } from "../context/LanguageContext";

// This is a higher-order component that wraps text content with translation capabilities
const Translate = memo(({ children, textKey }) => {
  const { tSync, t, language } = useLanguage();
  const [translatedText, setTranslatedText] = useState("");

  // Text to translate comes from either the textKey prop or children
  const textToTranslate = textKey || children;

  useEffect(() => {
    // For English, just use the original text
    if (!textToTranslate) {
      return;
    }

    // For English (source language), use the original text
    if (language === "en") {
      setTranslatedText(textToTranslate);
      return;
    }

    // Set initial text from sync version for non-English languages
    const initialTranslation = tSync(textToTranslate);
    setTranslatedText(initialTranslation);

    // Use async translation for potentially better quality
    const translateAsync = async () => {
      try {
        const result = await t(textToTranslate);
        if (result && result !== textToTranslate) {
          setTranslatedText(result);
        }
      } catch (error) {
        console.error("Translation component error:", error);
      }
    };

    translateAsync();
  }, [textToTranslate, language, t, tSync]);

  // Simply return the translated text or original text
  return <>{translatedText || textToTranslate}</>;
});

export default Translate;
