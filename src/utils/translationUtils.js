import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState } from "react";

/**
 * Hook to translate dynamic text without wrapping in a Translate component
 * @param {string} text - The text to translate
 * @returns {string} - The translated text
 */
export const useTranslateText = (text) => {
  const { tSync, language } = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (!text) {
      setTranslated("");
      return;
    }

    setTranslated(tSync(text));
  }, [text, tSync, language]);

  return translated;
};

/**
 * Hook to translate an array of objects with text fields
 * @param {Array} items - Array of objects containing text to translate
 * @param {Array} fields - Array of field names to translate in each object
 * @returns {Array} - Array with translated fields
 */
export const useTranslateItems = (items, fields) => {
  const { tSync, language } = useLanguage();
  const [translatedItems, setTranslatedItems] = useState([]);

  useEffect(() => {
    if (!items || !items.length || !fields || !fields.length) {
      setTranslatedItems(items || []);
      return;
    }

    const newItems = items.map((item) => {
      const newItem = { ...item };

      fields.forEach((field) => {
        if (item[field] && typeof item[field] === "string") {
          newItem[field] = tSync(item[field]);
        }
      });

      return newItem;
    });

    setTranslatedItems(newItems);
  }, [items, fields, tSync, language]);

  return translatedItems;
};

/**
 * Function to translate a piece of text immediately (non-hook version)
 * Use this in non-React contexts or when you can't use hooks
 * @param {function} tSync - The translation function from LanguageContext
 * @param {string} text - Text to translate
 * @returns {string} - Translated text
 */
export const translateText = (tSync, text) => {
  if (!text || !tSync) return text;
  return tSync(text);
};

/**
 * Higher-order component that adds translation capability to components
 * that display dynamic content
 * @param {Component} Component - React component to enhance with translation
 * @param {Array} textProps - List of props that contain text to translate
 * @returns {Component} - Enhanced component with translation
 */
export const withTranslation = (Component, textProps = []) => {
  // Return a new component
  return (props) => {
    const { tSync } = useLanguage();
    const translatedProps = { ...props };

    // Translate each specified prop
    textProps.forEach((propName) => {
      if (props[propName] && typeof props[propName] === "string") {
        translatedProps[propName] = tSync(props[propName]);
      }
    });

    // Return the component with translated props
    return <Component {...translatedProps} />;
  };
};
