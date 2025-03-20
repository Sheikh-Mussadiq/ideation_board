import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Component that can be used to translate dynamic content
 * It renders a component passed as the 'as' prop or a default element type,
 * and automatically translates the content passed in the 'content' prop
 */
const DynamicTranslation = ({
  content,                // Text content to translate
  as: Component = 'span', // HTML element or React component to render
  translateFields = [],   // Array of field names to translate in objects
  ...props               // Additional props to pass to the component
}) => {
  const { tSync, language } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState(content);
  
  useEffect(() => {
    // If content is empty, do nothing
    if (!content) {
      setTranslatedContent('');
      return;
    }
    
    // Case 1: String content - simply translate it
    if (typeof content === 'string') {
      setTranslatedContent(tSync(content));
      return;
    }
    
    // Case 2: Object with specified fields to translate
    if (typeof content === 'object' && !Array.isArray(content) && translateFields.length > 0) {
      const translatedObj = { ...content };
      
      translateFields.forEach(field => {
        if (content[field] && typeof content[field] === 'string') {
          translatedObj[field] = tSync(content[field]);
        }
      });
      
      setTranslatedContent(translatedObj);
      return;
    }
    
    // Case 3: Array of objects with specified fields to translate
    if (Array.isArray(content) && translateFields.length > 0) {
      const translatedArray = content.map(item => {
        if (typeof item !== 'object') return item;
        
        const translatedItem = { ...item };
        translateFields.forEach(field => {
          if (item[field] && typeof item[field] === 'string') {
            translatedItem[field] = tSync(item[field]);
          }
        });
        
        return translatedItem;
      });
      
      setTranslatedContent(translatedArray);
      return;
    }
    
    // Default: return content unchanged
    setTranslatedContent(content);
  }, [content, tSync, language, translateFields]);
  
  // For simple string content
  if (typeof content === 'string') {
    return <Component {...props}>{translatedContent}</Component>;
  }
  
  // For object content - pass the translated object as a prop
  return <Component {...props} content={translatedContent} />;
};

export default DynamicTranslation;
