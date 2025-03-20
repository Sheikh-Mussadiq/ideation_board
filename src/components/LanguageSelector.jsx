import React from 'react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage, languages } = useLanguage();

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="px-2 py-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:border-gray-700"
      >
        <option value={languages.ENGLISH}>English</option>
        <option value={languages.GERMAN}>Deutsch</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
