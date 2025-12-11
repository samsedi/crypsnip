// src/hooks/useLanguage.ts
import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';

export const useLanguage = () => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }

    // Context now includes t, locale, loading, and setLocale
    return context;
};