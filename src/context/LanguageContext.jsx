import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { translateText, batchTranslate } from '../services/translateService';

// Available languages
export const LANGUAGES = {
  ENGLISH: 'en',
  GERMAN: 'de'
};

// Create the Language Context
const LanguageContext = createContext();

// Translation cache to avoid unnecessary API calls
const translationCache = {};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(LANGUAGES.ENGLISH);
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [pendingTranslations, setPendingTranslations] = useState([]);
  const [translationBatchTimer, setTranslationBatchTimer] = useState(null);

  // Function to change the current language
  const changeLanguage = useCallback((newLanguage) => {
    if (Object.values(LANGUAGES).includes(newLanguage)) {
      localStorage.setItem('userLanguage', newLanguage);
      setLanguage(newLanguage);
    }
  }, []);

  // Function to translate text using Google Translate API
  const translateTextItem = useCallback(async (text, targetLanguage = language) => {
    // Don't translate if the language is English (source language) or text is empty
    if (targetLanguage === LANGUAGES.ENGLISH || !text) {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${targetLanguage}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    try {
      setIsLoading(true);
      
      const translatedText = await translateText(text, targetLanguage, LANGUAGES.ENGLISH);
      
      // Save to cache
      translationCache[cacheKey] = translatedText;
      
      // Update translations state
      setTranslations(prev => ({
        ...prev,
        [cacheKey]: translatedText
      }));
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Batch translation function for multiple texts at once
  const batchTranslateTexts = useCallback(async (textBatch) => {
    if (language === LANGUAGES.ENGLISH || !textBatch.length) return;
    
    try {
      setIsLoading(true);
      
      // Only send texts that aren't already in cache
      const textsToTranslate = textBatch.filter(text => {
        const cacheKey = `${text}_${language}`;
        return !translationCache[cacheKey];
      });
      
      if (textsToTranslate.length === 0) return;
      
      const translatedTexts = await batchTranslate(textsToTranslate, language, LANGUAGES.ENGLISH);
      
      // Update cache and translations state
      textsToTranslate.forEach((text, index) => {
        const cacheKey = `${text}_${language}`;
        translationCache[cacheKey] = translatedTexts[index];
        
        setTranslations(prev => ({
          ...prev,
          [cacheKey]: translatedTexts[index]
        }));
      });
    } catch (error) {
      console.error('Batch translation error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Process pending translations in batches
  useEffect(() => {
    if (pendingTranslations.length > 0 && !translationBatchTimer) {
      const timer = setTimeout(() => {
        batchTranslateTexts(pendingTranslations);
        setPendingTranslations([]);
        setTranslationBatchTimer(null);
      }, 300); // Batch for 300ms before sending
      
      setTranslationBatchTimer(timer);
    }
    
    return () => {
      if (translationBatchTimer) {
        clearTimeout(translationBatchTimer);
      }
    };
  }, [pendingTranslations, translationBatchTimer, batchTranslateTexts]);
  
  // Add text to pending translations batch
  const queueTranslation = useCallback((text) => {
    if (language === LANGUAGES.ENGLISH || !text) return;
    
    const cacheKey = `${text}_${language}`;
    if (!translationCache[cacheKey]) {
      setPendingTranslations(prev => [...prev, text]);
    }
  }, [language]);

  // Function to get text in the current language
  const t = useCallback(async (text) => {
    if (language === LANGUAGES.ENGLISH) {
      return text;
    }
    
    return translateTextItem(text, language);
  }, [language, translateTextItem]);

  // Synchronous version for components that can't handle async
  const tSync = useCallback((text) => {
    if (language === LANGUAGES.ENGLISH || !text) {
      return text;
    }
    
    const cacheKey = `${text}_${language}`;
    // Only queue new translations when not already in cache or translations state
    if (!translationCache[cacheKey] && !translations[cacheKey]) {
      queueTranslation(text);
    }
    return translations[cacheKey] || text;
  }, [language, translations, queueTranslation]);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('userLanguage');
    if (savedLanguage && Object.values(LANGUAGES).includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      changeLanguage, 
      t, 
      tSync, 
      translateText: translateTextItem,
      batchTranslate: batchTranslateTexts,
      queueTranslation,
      isLoading,
      languages: LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
