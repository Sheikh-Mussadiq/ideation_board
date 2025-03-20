import axios from 'axios';

const GOOGLE_TRANSLATE_API_BASE_URL = 'https://translation.googleapis.com/language/translate/v2';
// Directly use the API key for now to ensure it works
const API_KEY = 'AIzaSyAmqwmryt7St5wj1ZCkAWSgybehloiEDgA';

/**
 * Translate text using Google Translate API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'de' for German)
 * @param {string} sourceLanguage - Source language code (e.g., 'en' for English)
 * @returns {Promise<string>} - Translated text
 */
export const translateText = async (text, targetLanguage, sourceLanguage = 'en') => {
  try {
    // Don't translate if the language is the same or text is empty
    if (!text || targetLanguage === sourceLanguage) {
      return text;
    }
    
    console.log(`Translating text to ${targetLanguage}:`, text.substring(0, 20) + (text.length > 20 ? '...' : ''));
    
    const response = await axios({
      method: 'post',
      url: `${GOOGLE_TRANSLATE_API_BASE_URL}?key=${API_KEY}`,
      data: {
        q: text,
        target: targetLanguage,
        source: sourceLanguage,
        format: 'text'
      }
    });
    
    if (response.data && 
        response.data.data && 
        response.data.data.translations && 
        response.data.data.translations.length > 0) {
      console.log('Translation successful');
      return response.data.data.translations[0].translatedText;
    }
    
    console.warn('Translation response format unexpected:', response.data);
    return text;
  } catch (error) {
    console.error('Translation error:', error.response ? error.response.data : error.message);
    return text;
  }
};

/**
 * Translate multiple texts at once to improve performance
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code
 * @returns {Promise<string[]>} - Array of translated texts
 */
export const batchTranslate = async (texts, targetLanguage, sourceLanguage = 'en') => {
  try {
    // If no texts or target language is the same as source, return original texts
    if (!texts || !texts.length || targetLanguage === sourceLanguage) {
      return texts;
    }
    
    console.log(`Batch translating ${texts.length} texts to ${targetLanguage}`);
    
    const response = await axios({
      method: 'post',
      url: `${GOOGLE_TRANSLATE_API_BASE_URL}?key=${API_KEY}`,
      data: {
        q: texts,
        target: targetLanguage,
        source: sourceLanguage,
        format: 'text'
      }
    });
    
    if (response.data && 
        response.data.data && 
        response.data.data.translations) {
      console.log('Batch translation successful');
      return response.data.data.translations.map(t => t.translatedText);
    }
    
    console.warn('Batch translation response format unexpected:', response.data);
    return texts;
  } catch (error) {
    console.error('Batch translation error:', error.response ? error.response.data : error.message);
    return texts;
  }
};

export default {
  translateText,
  batchTranslate
};
