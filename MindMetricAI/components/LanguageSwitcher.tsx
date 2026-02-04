
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language.split('-')[0]; // Handle cases like 'en-US'

  return (
    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
      <button
        onClick={() => toggleLanguage('en')}
        className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
          currentLanguage === 'en'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => toggleLanguage('ru')}
        className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
          currentLanguage === 'ru'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        RU
      </button>
    </div>
  );
};

export default LanguageSwitcher;
