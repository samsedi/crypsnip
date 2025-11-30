// src/contexts/LanguageContext.tsx
import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from 'react';
import * as Localization from 'expo-localization';
import * as Location from 'expo-location';
import { I18n } from 'i18n-js';
import {
    translations,
    SupportedLocale,
    TranslationKey,
} from '../i18n/translations';
import { cryptoCountryLanguages } from '../i18n/cryptoCountries';

// Create a properly typed i18n instance
const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

interface LanguageContextType {
    t: (key: TranslationKey) => string;
    locale: SupportedLocale;
    loading: boolean;
    // Added setLocale to the context type
    setLocale: (newLocale: SupportedLocale) => void;
}

export const LanguageContext = createContext<LanguageContextType | null>(
    null,
);

interface Props {
    children: ReactNode;
}

export const LanguageProvider = ({ children }: Props) => {
    const [locale, setLocale] = useState<SupportedLocale>('en');
    const [loading, setLoading] = useState(true);

    // Function to safely change the language
    const changeLanguage = useCallback((newLocale: SupportedLocale) => {
        // Only change if it's a supported locale
        if (translations[newLocale]) {
            setLocale(newLocale);
            // i18n.locale is updated below via effect, but good practice to call it here too if needed immediately
            i18n.locale = newLocale;
        } else {
            console.error(`Locale ${newLocale} is not supported.`);
        }
    }, []);

    useEffect(() => {
        const detectLocale = async () => {
            try {
                // 1. Device locale (fast path)
                const deviceLocales = Localization.getLocales();
                const deviceLang = deviceLocales[0]?.languageCode as
                    | SupportedLocale
                    | undefined;

                if (deviceLang && translations[deviceLang]) {
                    setLocale(deviceLang);
                    setLoading(false);
                    return;
                }

                // 2. GPS fallback (crypto countries mapping)
                const { status } =
                    await Location.requestForegroundPermissionsAsync();

                if (status === 'granted') {
                    const location = await Location.getCurrentPositionAsync();
                    const [geo] = await Location.reverseGeocodeAsync(
                        location.coords,
                    );

                    const region = (geo as any).isoCountryCode as string | undefined;

                    if (region && region in cryptoCountryLanguages) {
                        const cryptoLang = cryptoCountryLanguages[
                            region as keyof typeof cryptoCountryLanguages
                            ];
                        setLocale((cryptoLang as SupportedLocale) || 'en');
                    } else {
                        setLocale('en');
                    }
                } else {
                    setLocale('en');
                }
            } catch (e) {
                setLocale('en');
            } finally {
                setLoading(false);
            }
        };

        void detectLocale();
    }, []);

    // Keep i18n in sync with state
    i18n.locale = locale;

    return (
        <LanguageContext.Provider
            value={{
                t: (key: TranslationKey) => i18n.t(key),
                locale,
                loading,
                setLocale: changeLanguage, // Exposed the change function
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};